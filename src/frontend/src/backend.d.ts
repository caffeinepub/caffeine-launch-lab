import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    totalCount: bigint;
    recentCount: bigint;
}
export interface ContentRecord {
    id: bigint;
    topic: string;
    hashtags: Array<string>;
    hooks: Array<string>;
    owner: Principal;
    script: string;
    canvaTips: string;
    timestamp: bigint;
    caption: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface Tool {
    id: bigint;
    emoji: string;
    name: string;
    kurzbeschreibung: string;
    zielgruppe: string;
    affiliateLink: [] | [string];
    fallbackLink: string;
    reihenfolge: bigint;
    isPublic: boolean;
}
export interface CreateToolArgs {
    emoji: string;
    name: string;
    kurzbeschreibung: string;
    zielgruppe: string;
    affiliateLink: [] | [string];
    fallbackLink: string;
    reihenfolge: bigint;
    isPublic: boolean;
}
export interface VisitorStats {
    totalVisits: bigint;
    dailyData: Array<[string, bigint]>;
}
export interface backendInterface {
    bulkDelete(ids: Array<bigint>): Promise<bigint>;
    deleteContent(id: bigint): Promise<boolean>;
    getAllHistory(): Promise<Array<ContentRecord>>;
    getMyHistory(): Promise<Array<ContentRecord>>;
    getStats(): Promise<Stats>;
    isCallerAdmin(): Promise<boolean>;
    saveContent(topic: string, hooks: Array<string>, script: string, canvaTips: string, caption: string, hashtags: Array<string>): Promise<bigint>;
    getPublicTools(): Promise<Array<Tool>>;
    getAllToolsAdmin(): Promise<Array<Tool>>;
    createTool(args: CreateToolArgs): Promise<bigint>;
    updateTool(id: bigint, args: CreateToolArgs): Promise<boolean>;
    deleteTool(id: bigint): Promise<boolean>;
    trackVisit(dayKey: string): Promise<void>;
    getVisitorStats(): Promise<VisitorStats>;
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
}
