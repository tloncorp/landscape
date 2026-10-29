const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const { createRequire } = require('node:module');
const path = require('node:path');
const test = require('node:test');
const { compileFunction } = require('node:vm');

// Compile the actual store with the app's bundler so its ES module cycles and
// aliases behave as they do in the browser. Only browser storage is in memory.
const src = path.resolve(__dirname, '../src');
let compiled;
test.before(async () => {
  const { build } = await import('vite');
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    resolve: { alias: { '@': src } },
    define: { 'import.meta.env.VITE_STORAGE_VERSION': JSON.stringify('1') },
    build: {
      ssr: path.join(src, 'state/local.ts'),
      write: false,
      rollupOptions: { output: { format: 'cjs', interop: 'auto' } },
    },
  });
  compiled = result.output.find((item) => item.type === 'chunk').code;
});

const storage = new Map();
let writes = 0;
global.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => {
    storage.set(key, value);
    writes += 1;
  },
  removeItem: (key) => storage.delete(key),
};
global.window = {
  ship: 'zod',
  desk: 'landscape',
  location: { hostname: 'localhost' },
};
let randomCalls = 0;
Object.defineProperty(global, 'crypto', {
  configurable: true,
  value: {
    // randomUUID deliberately absent, as it is unavailable on insecure origins.
    getRandomValues: (bytes) => {
      randomCalls += 1;
      return webcrypto.getRandomValues(bytes);
    },
  },
});

const storePath = path.join(src, 'state/local.ts');
const storageKey = '~zod/landscape/local';
function loadStore() {
  const loaded = { exports: {} };
  const evaluate = compileFunction(compiled, ['exports', 'require', 'module'], {
    filename: storePath,
  });
  evaluate(loaded.exports, createRequire(storePath), loaded);
  return loaded.exports;
}

test('keeps a persisted legacy browser ID without writing or collecting entropy', () => {
  storage.clear();
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      state: { browserId: 'existing-fingerprint-id', currentTheme: 'dark' },
      version: 1,
    })
  );
  const { initializeBrowserId, useLocalState } = loadStore();
  const writesBefore = writes;
  randomCalls = 0;
  initializeBrowserId();
  assert.equal(useLocalState.getState().browserId, 'existing-fingerprint-id');
  assert.equal(useLocalState.getState().currentTheme, 'dark');
  assert.equal(randomCalls, 0);
  assert.equal(writes, writesBefore);
});

test('creates and persists one ID across repeated initialization and reloads', () => {
  storage.clear();
  const { initializeBrowserId, useLocalState } = loadStore();
  let changes = 0;
  const unsubscribe = useLocalState.subscribe(() => {
    changes += 1;
  });
  randomCalls = 0;
  for (let i = 0; i < 8; i += 1) initializeBrowserId();
  const id = useLocalState.getState().browserId;
  assert.match(id, /^[0-9a-f]{32}$/);
  assert.equal(randomCalls, 1);
  assert.equal(changes, 1);
  assert.equal(
    JSON.parse(localStorage.getItem(storageKey)).state.browserId,
    id
  );
  unsubscribe();
  const reloaded = loadStore();
  reloaded.initializeBrowserId();
  assert.equal(reloaded.useLocalState.getState().browserId, id);
  assert.equal(randomCalls, 1);
});

test('creates a new browser identity after site storage is cleared', () => {
  storage.clear();
  const first = loadStore();
  first.initializeBrowserId();
  const previous = first.useLocalState.getState().browserId;
  storage.clear();
  const second = loadStore();
  second.initializeBrowserId();
  assert.notEqual(second.useLocalState.getState().browserId, previous);
});
