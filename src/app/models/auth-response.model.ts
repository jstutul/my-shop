import { User } from "./user.model";

export interface AuthResponse{
    jwt: string;
    refreshToken: string;
    user:User;
}