import { getToken } from "@/lib/auth";
import { CreateScheduleDto, Schedule } from "@/types/schedule";

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

export async function createSchedule(data: CreateScheduleDto) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create schedule')
    }
    const result = await res.json()
    return result;
}

export async function assignDocToSchedule(scheduleId: string, doctorId: string) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}/assign/${doctorId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to assign doctor to schedule');
    }
    const result = await res.json();
    return result;
}

export async function updateSchedule(scheduleId: string, data: CreateScheduleDto) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to update schedule');
    }
    const result = await res.json();
    return result;
}

export async function deleteSchedule(scheduleId: string) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to delete schedule');
    }
    const result = await res.json();
    return result;
}   

export async function removeDoctorFromSchedule(scheduleId: string, doctorId: string) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}/remove/${doctorId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to remove doctor from schedule');
    }
    const result = await res.json();
    return result;
}


