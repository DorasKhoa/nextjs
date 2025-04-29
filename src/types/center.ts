import { Department } from "./department";
import { Doctor } from "./doctor";
import { Requirement } from "./requirement";

export interface Center {
    _id: string;
    local: string;
    contact: string;
    doctors?: Doctor[],
    requirements?: Requirement[]
    departments?: Department[]
}

export interface NewCenter {
    local: string;
    contact: string;
}