# Landscape

Landscape provides the primary launching interface for Tlon's suite of userspace applications. This repository contains the front-end web application to power said interface.

Landscape is built primarily using [React], [Typescript], and [Tailwind CSS]. [Vite] ensures that all code and assets are loaded appropriately, bundles the application for distribution and provides a functional dev environment.

## Getting Started

To get started using Landscape first you need to run `npm i` from the `ui` directory.

Once that's done, you can then run `npm run mock` if you'd like to get started immediately. This will use hard-coded mock data to power the interface so you can work on the interface without being connected to a ship.

To develop against a working ship, you first need to add a `.env.local` file to the `./ui` directory. This file will not be committed. Adding `VITE_SHIP_URL={URL}` where **{URL}** is the URL of the ship you would like to point to, will allow you to run `npm run dev`. This will proxy all requests to the ship except for those powering the interface, allowing you to see live data.

Regardless of what you run to develop, Vite will hot-reload code changes as you work so you don't have to constantly refresh.

## Desk dependencies (peru)

The Hoon `desk/` holds only landscape's own source. Its upstream dependencies (a
curated subset of urbit's `pkg/base-dev` — `default-agent`, `dbug`, `server`,
the standard marks, etc.) are vendored by [peru] into a separate, **gitignored**
`desk-deps/` tree, per `peru.yaml`. This replaced rsyncing _all_ of `pkg/base-dev`,
which pulled in unused files that the new kernel — which builds every mark on a
desk — fails to compile.

- A fresh checkout's `desk/{lib,sur,mar}` is intentionally **missing** the
  standard files (`default-agent`, `dbug`, `server`, `hoon`, `json`, …) — they
  live in `desk-deps/` after a sync. Don't "fix" this by committing them.
- `./scripts/sync-deps.sh` (= `peru sync`) — populate `desk-deps/`. Run after
  cloning and after editing `peru.yaml`. Requires peru (`pipx install peru`).
- `./scripts/assemble-desk.sh <target>` — assemble a full desk into `<target>`:
  rsync `desk-deps/` in with `--delete`, then `desk/` on top, then stamp
  `commit.txt`. This is how the `%landscape` desk is built for a ship (used by
  `.github/helpers/deploy.sh` and for local dev).
- The upstream kernel rev is **pinned in `peru.yaml`**. To build against a
  different kernel, change `rev` there on your branch.

[peru]: https://github.com/buildinspace/peru

## Deploying

Deploys to internal moons are managed via github actions.

[react]: https://reactjs.org/
[typescript]: https://www.typescriptlang.org/
[tailwind css]: https://tailwindcss.com/
[vite]: https://vitejs.dev/
