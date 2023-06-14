import { Poke } from "@urbit/http-api";
import { ApprovePermsPoke, DenyPermsPoke, Passport, Perm, PokePerm, Seal } from "./types";
import api from "@/api";

export function approvePerms(desk: string, perms: PokePerm[]): Poke<ApprovePermsPoke> {
  return {
    app: 'helm',
    mark: 'helm-hope',
    json: {
      desk,
      perms
    }
  };
}

export function denyPerms(desk: string, perms: PokePerm[]): Poke<DenyPermsPoke> {
  return {
    app: 'helm',
    mark: 'helm-curb',
    json: {
      desk,
      perms
    }
  };
}

export async function sealToPassport(seal: Seal) {
  return await api.thread<Passport, Seal>({
    inputMark: "json",
    outputMark: "json",
    threadName: "get-passport",
    body: seal
  });
}
