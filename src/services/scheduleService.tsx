import { getToken } from "@/lib/auth";
import { Schedule } from "@/types/schedule";

export async function fetchAllSchedules(): Promise<Schedule[]> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules`,{
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch schedule')
    }
    const result = await res.json()
    return result
}