/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const UserRole = IDL.Variant({
  'admin' : IDL.Null,
  'user' : IDL.Null,
  'guest' : IDL.Null,
});
export const ContentRecord = IDL.Record({
  'id' : IDL.Nat,
  'topic' : IDL.Text,
  'hashtags' : IDL.Vec(IDL.Text),
  'hooks' : IDL.Vec(IDL.Text),
  'owner' : IDL.Principal,
  'script' : IDL.Text,
  'canvaTips' : IDL.Text,
  'timestamp' : IDL.Int,
  'caption' : IDL.Text,
});
export const UserProfile = IDL.Record({ 'name' : IDL.Text });
export const Stats = IDL.Record({
  'totalCount' : IDL.Nat,
  'recentCount' : IDL.Nat,
});
export const Tool = IDL.Record({
  'id' : IDL.Nat,
  'emoji' : IDL.Text,
  'name' : IDL.Text,
  'kurzbeschreibung' : IDL.Text,
  'zielgruppe' : IDL.Text,
  'affiliateLink' : IDL.Opt(IDL.Text),
  'fallbackLink' : IDL.Text,
  'reihenfolge' : IDL.Nat,
  'isPublic' : IDL.Bool,
});
export const CreateToolArgs = IDL.Record({
  'emoji' : IDL.Text,
  'name' : IDL.Text,
  'kurzbeschreibung' : IDL.Text,
  'zielgruppe' : IDL.Text,
  'affiliateLink' : IDL.Opt(IDL.Text),
  'fallbackLink' : IDL.Text,
  'reihenfolge' : IDL.Nat,
  'isPublic' : IDL.Bool,
});
export const VisitorStats = IDL.Record({
  'totalVisits' : IDL.Nat,
  'dailyData' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
});

export const idlService = IDL.Service({
  '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
  'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
  'bulkDelete' : IDL.Func([IDL.Vec(IDL.Nat)], [IDL.Nat], []),
  'deleteContent' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'getAllHistory' : IDL.Func([], [IDL.Vec(ContentRecord)], ['query']),
  'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
  'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
  'getMyHistory' : IDL.Func([], [IDL.Vec(ContentRecord)], ['query']),
  'getStats' : IDL.Func([], [Stats], ['query']),
  'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
  'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
  'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
  'saveContent' : IDL.Func(
      [IDL.Text, IDL.Vec(IDL.Text), IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
      [IDL.Nat],
      [],
    ),
  'getPublicTools' : IDL.Func([], [IDL.Vec(Tool)], ['query']),
  'getAllToolsAdmin' : IDL.Func([], [IDL.Vec(Tool)], ['query']),
  'createTool' : IDL.Func([CreateToolArgs], [IDL.Nat], []),
  'updateTool' : IDL.Func([IDL.Nat, CreateToolArgs], [IDL.Bool], []),
  'deleteTool' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'trackVisit' : IDL.Func([IDL.Text], [], []),
  'getVisitorStats' : IDL.Func([], [VisitorStats], ['query']),
});

export const idlFactory = ({ IDL: _IDL }) => {
  return idlService;
};
export const init = ({ IDL: _IDL }) => { return []; };
