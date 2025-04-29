export interface Requirement{
    _id: string;
    center: string;
    name: string;
    instruction: string;
    quantity: number;
}

export interface NewRequirement {
    name: string;
    instruction: string;
    quantity: number;
  }