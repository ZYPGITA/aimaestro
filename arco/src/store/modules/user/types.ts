export type RoleType = 'user' | 'admin'

export interface UserState {
    username: string;
    role: RoleType;
}