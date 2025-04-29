import { Order } from "./order";
import { Schedule } from "./schedule";

export interface DoctorSummary {
    id: string;
    name: string;
    fees: number;
    email?:string;
    avatar? : string
    category: string
}

export interface Doctor {
    _id: string;
    avatar: string;
    name: string;
    email?:string;
    phone: number;
    fees: number;
    address?: string;
    dob?: string;
    center?: {
        local?:string;
    }
    category: string
    schedules?: Schedule[];
    order?: Order[];
}