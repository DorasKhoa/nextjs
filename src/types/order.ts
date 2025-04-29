export interface Order {
    id: string;
    fees: number;
    payment: string;
    doctor: {
        name: string,
        avatar: string
    };
    schedule: {
        start: string,
        end: string,
        date: string
    }
    status: string
}
export interface DocOrder {
    _id: string;
    fees: number;
    payment: string;
    user: {
        name: string,
        email: string
    };
    schedule: {
        start: string,
        end: string,
        date: string
    }
    status: string;
    createdAt: string;
}