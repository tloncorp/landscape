import { BigIntOrderedMap } from "./BigIntOrderedMap";

export type SetElement<S> = S extends Set<(infer T)> ? T : never;
export type MapKey<M> = M extends Map<(infer K), any> ? K : never;
export type MapValue<M> = M extends Map<any, (infer V)> ? V : never;

/**
 * Turns sets into arrays and maps into objects so we can send them over the wire
 */
export type Enc<S> =
    S extends Set<any> ?
    Enc<SetElement<S>>[] :
    S extends Map<string, any> ?
    { [s: string]: Enc<MapValue<S>> } :
    S extends object ?
    { [K in keyof S]: Enc<S[K]> } :
    S extends BigIntOrderedMap<infer T> ?
    { [index: string]: T } :
    S;


export type ShipRank = 'czar' | 'king' | 'duke' | 'earl' | 'pawn';

// @uvH encoded string
export type Serial = string;
