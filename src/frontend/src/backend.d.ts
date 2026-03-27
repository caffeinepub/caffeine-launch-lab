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
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkDelete(ids: Array<bigint>): Promise<bigint>;
    deleteContent(id: bigint): Promise<boolean>;
    getAllHistory(): Promise<Array<ContentRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyHistory(): Promise<Array<ContentRecord>>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveContent(topic: string, hooks: Array<string>, script: string, canvaTips: string, caption: string, hashtags: Array<string>): Promise<bigint>;
}
