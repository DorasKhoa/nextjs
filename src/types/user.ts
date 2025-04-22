export interface User{
    _id: string;
    password: string;
    avatar: string;
    role: string;
    name: string;
    email: string;
    address: string;
    phone: number;
    dob: string;
    fees: number;
    category: string
}

export interface CreateUserJson {
    name: string;
    email: string;
    password: string;
    role: string;
    category: string;
}