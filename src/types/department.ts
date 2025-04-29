export interface NewDepartment {
    name: string;
  }
  export interface Department {
    _id: string;
    center: string;
    name: string;
    doctor?: {
        name: string;
        email: string
    } 
}