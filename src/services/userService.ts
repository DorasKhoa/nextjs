import { getToken } from "@/lib/auth"
import { CreateUserJson, User } from "@/types/user";

export async function fetchAllUsers(): Promise<User[]> {
    const token = getToken()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch users');
    }

    const data = await res.json();
    return data
}

export async function updateUserById(id: string, form: FormData): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Update failed");
    }

    const result = await res.json();
    return result.message || "Update successful";
}

export async function createUser(data: CreateUserJson): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Create user failed!');
    }

    const result = await res.json();
    return result.data || 'User created successfully!'
}