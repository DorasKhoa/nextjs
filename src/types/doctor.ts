import { Schedule } from "./schedule";

export interface DoctorSummary {
    id: string;
    name: string;
    fees: number;
    avatar? : string
    category: string
}

export interface Doctor {
    id: string;
    avatar: string;
    name: string
    phone: number;
    fees: number;
    center?: {
        local?:string;
    }
    category: string
    schedules?: Schedule[];
}