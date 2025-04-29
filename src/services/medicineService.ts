import { getToken } from "@/lib/auth";
import { Medicine } from "@/types/medicine";

export async function fetchAllMedicine():Promise<Medicine[]> {
    const token = getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicines`,{
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch medicine');
    }
    return await res.json()
}

export async function createMedicine(data: Medicine):Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicines`,{
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create medicine')
    }
    const result = await res.json();
    return result.message
}

export async function editMedicine(data: Medicine, id: string): Promise<Medicine> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicines/${id}`,{
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to update medicine')
    }
    const result = await res.json()
    return result.message
}

export async function deleteMedicine(id:string): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicines/${id}`,{
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`,}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to delete medicine')
    }
    const result = await res.json()
    return result.message;
}