import { getToken } from "@/lib/auth";
import { Center, NewCenter } from "@/types/center";
import { json } from "stream/consumers";

export async function fetchAllCenters(): Promise<Center[]> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers`,{
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch centers')
    }

    return await res.json()
}

export async function createCenter(data: NewCenter): Promise<NewCenter> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers`,{
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create center');
    }

    return await res.json();
}

export async function findCenterById(id: string): Promise<Center> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers/${id}`,{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch center by id');
    }
    return await res.json();
}

export async function updateCenter(id: string, data:NewCenter): Promise<string> {
    const token = getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers/${id}`,{
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to updated center')
    }

    const result = await res.json()
    return result.message;
}

export async function assignDocToCenter(centerId: string, doctorId: string): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers/${centerId}/assign/${doctorId}`,{
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }        
    })

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to assign');
    }

    const result = await res.json()
    return result.message;
}

export async function deleteCenter(id:string): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers/${id}`,{
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to delete center');
    }
    const result = await res.json();
    return result.message;
}

export async function removeDocFromCenter(centerId: string, doctorId: string): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers/${centerId}/remove/${doctorId}`,{
        method: 'PATCH',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to remove doctor from center');
    }
    const result = await res.json();
    return result.message;
}       
