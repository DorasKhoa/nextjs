import { getToken } from "@/lib/auth";
import { DocOrder, Order } from "@/types/order";
import { start } from "repl";

export async function bookSchedule(scheduleId: string): Promise<string> {
    const token = getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${scheduleId}`,{
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
    })

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'failed to book schedule');
    }

    const data = await res.json()
    return data.message
}

export async function fetchMyOrders(): Promise<Order[]> {
    const token = getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/me`,{
        headers: {Authorization: `Bearer ${token}`}
    })

    if(!res.ok) throw new Error('Failed to fetch orders');

    const data = await res.json();
    return data.map((o:any) => ({
        id: o._id,
        fees: o.fees,
        payment: o.payment,
        status: o.status,
        doctor: {
            avatar: o.doctor?.avatar || '/defaultavatar.jpg',
            name: o.doctor?.name || 'Unknown'
        },
        schedule: o.schedule
        ? {
            date: o.schedule.date,
            start: o.schedule.start,
            end: o.schedule.end,
        }
        : {
            date: 'N/A',
            start: 'N/A',
            end: 'N/A'
        }
    }))
}

export async function payOrderWithCard(orderId: string): Promise<string> {
    const token = getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/paid/${orderId}`,{
        method: 'PATCH',
        headers: {Authorization: `Bearer ${token}`}
    })
    
    const data = await res.json();
    if(!res.ok) throw new Error(data.message || 'Failed to pay');

    return data.message;
}

export async function cancelOrder(orderId: string): Promise<string> {
    const token = getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/cancel/${orderId}`,{
        method: 'PATCH',
        headers: {Authorization: `Bearer ${token}`}
    })

    const data = await res.json()
    if(!res.ok) throw new Error(data.message || 'Failed to cancel');

    return data.message;
}

export async function rejectOrder(orderId: string): Promise<string> {
    const token = getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/reject/${orderId}`,{
        method: 'PATCH',
        headers: {Authorization: `Bearer ${token}`}
    })

    const data = await res.json()
    if(!res.ok) throw new Error(data.message || 'Failed to reject');

    return data.message;
}

export async function approveOrder(orderId: string): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/approve/${orderId}`,{
        method: 'PATCH',
        headers: {Authorization: `Bearer ${token}`}
    });
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to approve order');
    }
    const result = await res.json()
    return result.message;
}

export async function fetchDoctorOrders(): Promise<DocOrder[]> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/doctor`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch doctor orders');
    return await res.json();
}
