import { getToken } from "@/lib/auth";
import { Doctor, DoctorSummary } from "@/types/doctor";

export async function fetchDoctors(): Promise<DoctorSummary[]> {
    const token = getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/alldoc`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('Failed to fetch doctors');

    const rawDoctors = await res.json();

    return rawDoctors.map((doc: any) => ({
        id: doc._id,
        name: doc.name,
        email: doc.email,
        fees: doc.fees,
        avatar: doc.avatar,
        category: doc.category
    }));
}

export async function fetchDoctorById(id: string): Promise<Doctor> {
    const token = getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/find/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch doctor');

    const doc = await res.json()
    console.log()
    return {
        _id: doc.id,
        avatar: doc.avatar,
        name: doc.name,
        phone: doc.phone,
        fees: doc.fees,
        center: { local: doc.center?.local },
        category: doc.category,
        schedules: doc.schedules
        ?.filter((s:any) => s.status === 'PENDING')
        .map((s: any) => ({
            id: s._id,
            start: s.start,
            end: s.end,
            date: s.date,
            status: s.status
        }))
    }
}

export async function doctorProfile(): Promise<Doctor> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`,{
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch profile');
    }
    return await res.json();
}

export async function updateDoctor(form: FormData): Promise<string> {
    const token = getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`,{
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: form
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to update profile')
    }
    const result = await res.json();
    return result.message
}