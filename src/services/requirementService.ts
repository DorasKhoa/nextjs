import { getToken } from "@/lib/auth";
import { NewRequirement, Requirement } from "@/types/requirement";

export async function addRequirement(centerId: string, data: NewRequirement) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requirements/${centerId}`,{
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data),
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to add requirement');
    }
    
    const result = await res.json();
    return result.message;
}

export async function removeRequirement(requirementId: string) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requirements/${requirementId}`,{
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to remove requirement');
    }
    const result = await res.json();
    return result.message;
}   

export async function updateRequirement(requirementId: string, data: NewRequirement) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requirements/${requirementId}`,{
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data),
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to update requirement');
    }
    const result = await res.json();
    return result.message;
}

