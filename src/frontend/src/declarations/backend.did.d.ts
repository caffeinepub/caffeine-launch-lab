/* eslint-disable */
// @ts-nocheck
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface ContentRecord {
  'id' : bigint,
  'topic' : string,
  'hashtags' : Array<string>,
  'hooks' : Array<string>,
  'owner' : Principal,
  'script' : string,
  'canvaTips' : string,
  'timestamp' : bigint,
  'caption' : string,
}
export interface Stats { 'totalCount' : bigint, 'recentCount' : bigint }
export interface Tool {
  'id' : bigint,
  'emoji' : string,
  'name' : string,
  'kurzbeschreibung' : string,
  'zielgruppe' : string,
  'affiliateLink' : [] | [string],
  'fallbackLink' : string,
  'reihenfolge' : bigint,
  'isPublic' : boolean,
}
export interface CreateToolArgs {
  'emoji' : string,
  'name' : string,
  'kurzbeschreibung' : string,
  'zielgruppe' : string,
  'affiliateLink' : [] | [string],
  'fallbackLink' : string,
  'reihenfolge' : bigint,
  'isPublic' : boolean,
}
export interface VisitorStats {
  'totalVisits' : bigint,
  'dailyData' : Array<[string, bigint]>,
}
// _SERVICE must match main.mo exactly.
// Phantom methods (assignCallerUserRole, getCallerUserRole, getCallerUserProfile,
// getUserProfile, saveCallerUserProfile) that do NOT exist in main.mo have been
// removed to prevent IC agent validation failures.
export interface _SERVICE {
  '_initializeAccessControlWithSecret' : ActorMethod<[string], undefined>,
  'bulkDelete' : ActorMethod<[Array<bigint>], bigint>,
  'deleteContent' : ActorMethod<[bigint], boolean>,
  'getAllHistory' : ActorMethod<[], Array<ContentRecord>>,
  'getMyHistory' : ActorMethod<[], Array<ContentRecord>>,
  'getStats' : ActorMethod<[], Stats>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'saveContent' : ActorMethod<[string, Array<string>, string, string, string, Array<string>], bigint>,
  'getPublicTools' : ActorMethod<[], Array<Tool>>,
  'getAllToolsAdmin' : ActorMethod<[], Array<Tool>>,
  'createTool' : ActorMethod<[CreateToolArgs], bigint>,
  'updateTool' : ActorMethod<[bigint, CreateToolArgs], boolean>,
  'deleteTool' : ActorMethod<[bigint], boolean>,
  'trackVisit' : ActorMethod<[string], undefined>,
  'getVisitorStats' : ActorMethod<[], VisitorStats>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
