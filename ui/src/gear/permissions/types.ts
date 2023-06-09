
type PermType = "super" | "watch" | "write" | "reads" | "press";

type Vane = 'ames' | 'behn' | 'clay' | 'dill' | 'eyre' | 'gall' | 'iris' | 'jael' | 'khan';

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
 * A passport-formatted permission
 */
export interface PassportPerm {
  kind: {
    nom: string;
    pes: PermSummary[]
  }
}

export interface AppPerm {
  pes: {
    node: PermSummary[]
  };
  app: string;
}

/**
  * Per lib/perms.hoon, Passport is intended for consumption by permission
  * management frontends.
  */
export interface Passport {
  /**
   * Categorized perms
   */
  rad: PassportPerm[];
  /**
   * Dangerous perms
   */
  sys: PassportPerm[];
  /**
   * All apps perms
   */
  any: PassportPerm[];
  /**
   * Unknown app perms
   */
  new: PassportPerm[];
  /**
   * Specific app perms
   */
  app: AppPerm[];
}
