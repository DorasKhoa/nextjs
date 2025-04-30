import { getToken } from "@/lib/auth";
import { Check } from "@/types/check";

export async function fetchAllCheck(): Promise<Check> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checks`,{
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) throw new Error('Failed to fetch payment history')
    return await res.json();
}