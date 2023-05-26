/**
 *  A server identity
 */
type Dude = string;

/**
 * path - ship desk case spur
 */
type Spur = string;

/**
 * specific or any desk, at or under spur prefix
 */
interface Burr {
  desk: string | null;
  spur: Spur;
}

/**
 * burr with specific or any care
 */
interface Spar {
  care: string | null;
  burr: Burr;
}

interface PokePerm {
  "write": {
    jump: boolean;
    dude: Dude | null;
  }
}

interface SubscribePerm {
  "watch": {
    jump: boolean;
    dude: Dude | null;
    path: string;
  }
}

interface ScryPerm {
  "reads": {
    vane: string;
    spar: Spar;
  }
}

interface PressPerm {
  "press": {
    spur: Spur;
  }
}

/**
 * A system permission
 */
export type Perm = PokePerm | SubscribePerm | ScryPerm | PressPerm;
