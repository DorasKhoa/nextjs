export interface Schedule {
    _id: string;
    start: string;
    end: string;
    date: string;
    status: string;
    user?: {
        _id: string;
        name: string;
        email: string;
    }
    doctor?: {
        _id: string;
        name: string;
    };
}