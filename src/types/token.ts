export interface Token {
    sub: string;
    username: string;
    role: string;
    iat: number;
    exp: number;
}