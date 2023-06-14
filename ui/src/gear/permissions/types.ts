
type PermType = "super" | "watch" | "write" | "reads" | "press";

type Vane = 'ames' | 'behn' | 'clay' | 'dill' | 'eyre' | 'fine' | 'gall' | 'iris' | 'jael' | 'khan';

type Tail = {
  jump?: boolean;
  care?: string | null;
  desk?: string | null;
  dude?: string | null;
  path?: string | null;
  ship?: string | null;
  spur?: string | null;
  vane?: string | null;
} | null;


export interface Perm {
  name: PermType;
  vane: Vane | null;
  tail: Tail;
}

export type Seal = Perm[];

export interface PermSummary {
  desc: string;
  // TODO: per tinnus, "have" is meant to say whether the app already has all / 
  // any of / none of the perms in question but currently it doesn't, it just 
  // always says nil.
  have: "nil"
  pers: Perm[];
  warn: string | null;
}

/**
 * Passport-formatted permissions
 */
interface AppPerm {
  pes: {
    node: PermSummary[]
  };
  app: string;
}

interface KindPerm {
  kind: {
    nom: string;
    pes: PermSummary[]
  }
}

interface NodePerm {
  node: PermSummary;
}

/**
  * Per lib/perms.hoon, Passport is intended for consumption by permission
  * management frontends.
  */
export interface Passport {
  /**
   * Categorized perms
   */
  rad: KindPerm[];
  /**
   * Dangerous perms
   */
  sys: (KindPerm | NodePerm )[];
  /**
   * All apps perms
   */
  any: KindPerm[];
  /**
   * Unknown app perms
   */
  new: KindPerm[];
  /**
   * Specific app perms
   */
  app: AppPerm[];
}

/**
 * The following perms are used for the poke to approve or deny perms
 * on a desk.
 * 
 * See: pers, perm-gall, perm-arvo in lull.hoon
 */

/**
 * shared types from lull.hoon
 */

type Spur = string;

interface Burr {
  desk: string | null;
  spur: Spur;
}

interface Spar {
  care: string | null;
  burr: Burr;
}

/**
 * perm-arvo in lull.hoon
 */

/**
 * Ames
 */

interface AmesDebugPerm {
  debug: null;
}

interface AmesBlockPerm {
  block: null;
}

interface AmesOrderPerm {
  ship: string | null;
  path: string;
}

interface AmesWhackPerm {
  ship: string | null;
  path: string;
}

type AmesPerm = {
  ames: AmesDebugPerm | AmesBlockPerm | AmesOrderPerm | AmesWhackPerm;
}

/**
 * Behn
 */

interface BehnTimerPerm {
  timer: null;
}

type BehnPerm = {
  behn: BehnTimerPerm;
}

/**
 * Clay
 */

interface ClayMountPerm {
  mount: null;
}

interface ClayCredsPerm {
  creds: null;
}

interface ClayLabelPerm {
  desk: string | null;
}

interface ClayWritePerm {
  burr: Burr;
}

interface ClayLocalPerm {
  spar: Spar;
}

interface ClayPeersPerm {
  spar: Spar;
}

interface ClayPermsPerm {
  desk: string | null;
}

interface ClayPleadPerm {
  desk: string | null;
}

interface ClayLivenPerm {
  desk: string | null;
}

interface ClayPulsePerm {
  pulse: null;
}

interface ClayGravePerm {
  ship: string | null;
  desk: string | null;
}

type ClayPerm = {
  clay: ClayMountPerm | ClayCredsPerm | ClayLabelPerm | ClayWritePerm | ClayLocalPerm | ClayPeersPerm | ClayPermsPerm | ClayPleadPerm | ClayLivenPerm | ClayPulsePerm | ClayGravePerm;
}

/**
 * Dill
 */

interface DillViewsPerm {
  views: null;
}

interface DillInputPerm {
  input: null;
}

interface DillPrintPerm {
  print: null;
}

interface DillExtraPerm {
  extra: null;
}

type DillPerm = {
  dill: DillViewsPerm | DillInputPerm | DillPrintPerm | DillExtraPerm;
}

/**
 * Eyre
 */

interface EyreServePerm {
  serve: null;
}

interface EyreCertsPerm {
  certs: null;
}

interface EyrePermsPerm {
  perms: null;
}

type EyrePerm = {
  eyre: EyreServePerm | EyreCertsPerm | EyrePermsPerm;
}

/**
 * Fine
 */

// No %fine perms yet

/**
 * Gall
 */

interface GallClearPerm {
  dude: string | null;
}

interface GallGuardPerm {
  guard: null;
}

type GallPerm = {
  gall: GallClearPerm | GallGuardPerm;
}

/**
 * Iris
 */

interface IrisFetchPerm {
  fetch: null;
}

type IrisPerm = {
  iris: IrisFetchPerm;
}

/**
 * Jael
 */

interface JaelMoonsPerm {
  moons: null;
}

interface JaelPrickPerm {
  prick: null;
}

interface JaelCreakPerm {
  creak: null;
}

interface JaelLoginPerm {
  login: null;
}

interface JaelBreakPerm {
  break: null;
}

type JaelPerm = JaelMoonsPerm | JaelPrickPerm | JaelCreakPerm | JaelLoginPerm | JaelLoginPerm | JaelBreakPerm;

/**
 * Khan
 */

interface KhanTreadPerm {
  tread: null;
}

type KhanPerm = KhanTreadPerm;

type ArvoPerm = AmesPerm | BehnPerm | ClayPerm | DillPerm | EyrePerm | GallPerm | IrisPerm | JaelPerm | KhanPerm;

/**
 * perm-gall in lull.hoon
 */

interface AgentWritePerm {
  write: {
    jump: boolean;
    dude: string | null;
  }
}

interface AgentWatchPerm {
  watch: {
    jump: boolean;
    dude: string | null;
    path: string;
  }
}

interface AgentReadsPerm {
  reads: {
    vane: string;
    spar: Spar;
  }
}

interface AgentPressPerm {
  press: {
    spur: Spur;
  }
}

type InterAgentPerm = AgentWritePerm | AgentWatchPerm | AgentReadsPerm | AgentPressPerm;

export type PokePerm = ArvoPerm | InterAgentPerm;

export interface ApprovePermsPoke {
  desk: string;
  perms: PokePerm[];
}

export interface DenyPermsPoke {
  desk: string;
  perms: PokePerm[];
}
