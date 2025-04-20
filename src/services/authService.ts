import { LoginPayload, RegisterPayload } from "@/types/auth";

export async function login(payload: LoginPayload) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });

    if(!res.ok) {
        throw new Error("Login failed")
    }
    
    return res.json();
}

export async function register(payload: RegisterPayload) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    })

    if(!res.ok) {
        throw new Error("Register failed");
    }

    return res.json();
}