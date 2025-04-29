import { getToken } from "@/lib/auth";
import { News } from "@/types/news";

export async function createNews(formData: FormData): Promise<{ message: string }> {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create news');
    }

    return response.json();
}

export async function fetchAllnews(): Promise<News[]> {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch news');
    }

    return response.json();
}

export async function editNews(id: string, formData: FormData): Promise<{ message: string }> {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to edit news');
    }

    return response.json();
}

export async function deleteNews(id: string): Promise<{ message: string }> {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete news');
    }

    return response.json();
}