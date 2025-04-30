import { getToken } from "@/lib/auth";
import { Cart } from "@/types/cart";

export async function addToCart(medicineId: string, amount: number): Promise<Cart> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${medicineId}`,{
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: amount })
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to add to cart')
    }
    const result = await res.json()
    return result.message
}

export async function fetchAllCart(clientId: string): Promise<Cart[]> {
    const token = getToken();
    const res = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/carts`,{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch cart')
    }
    return await res.json()
}

export async function removeMedfromCart(cartId: string): Promise<string> {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${cartId}`,{
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to remove medicine from cart')
    }
    const result = await res.json()
    return result.message
}

export async function payWithCard(cartId: string): Promise<string> {
    const token = getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/card/${cartId}`,{
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to pay with card')
    }
    const result = await res.json()
    return result.message
}
export async function payWithCash(cartId: string): Promise<string> {
    const token = getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/cash/${cartId}`,{
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`}
    })
    if(!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to pay with cash')
    }
    const result = await res.json()
    return result.message
}