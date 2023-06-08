/**
 * A component's kelvin version
 */
export interface Weft {
  /**
   *  Name of the component
   *
   *  @remarks
   *  Usually %zuse, %hoon, or %lull
   */
  name: string;
  /**
   * Kelvin version
   *
   */
  kelvin: number;
}

/**
 * Cases for revision
 *
 */
export interface Cass {
  /**
   * Revision number
   */
  ud: number;
  /**
   * Timestamp of revision, as stringifed `@da`
   *
   * @remarks
   * If \@da is outside valid positive unix timestamp, value will be zero
   */
  da: string;
}

/**
 * TODO: crisp one-liner describing a Pike
 */
export interface Pike {
  /**
   * Hash of the desk, rendered as `@uv`
   *
   * @remarks
   * Equivalent to
   * ```hoon
   * .^(@uv %cz /=desk=)
   * ```
   */
  hash: string;
  sync: {
    /**
     * Source desk for this Pike
     */
    desk: string;
    /**
     * Source ship for this Pike
     */
    ship: string;
  } | null;
  /**
   *  {@link Weft}s associated with this Pike
   */
  wefts: Weft[];
  /**
   * how live is this pike?
   * 
   * live - app is running
   * held - app is not running, but is trying to run. this state can be entered
   * in two main ways: 
   *   - when installing an app but it hasn't finished downloading (or it did 
   *     but failed to install for some reason)
   *   - when user forced a kelvin upgrade by suspending desks.
   * dead - app is not running
   */
  zest: "live" | "dead" | "held";
}

export interface Pikes {
  [desk: string]: Pike;
}
