import { getToken } from "@/lib/auth";
import { NewDepartment } from "@/types/department";

export async function createDepartment(centerId: string, data: NewDepartment): Promise<string> {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/${centerId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'failed to create department');
  }

  const result = await res.json();
  return result.message;
}

export async function assignDocToDepartment(departmentId: string, doctorId: string) {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/${departmentId}/assign/${doctorId}`, {
    method: 'PATCH',
    headers: {Authorization: `Bearer ${token}`}
  })
  if(!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Failed to assign doctor to department');
  }
  const result = await res.json();
  return result.message;
}

export async function removeDocFromDepartment(departmentId: string) {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/${departmentId}/remove`, {
    method: 'PATCH',
    headers: {Authorization: `Bearer ${token}`}
  })
  if(!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Failed to remove doctor from department');
  }
  const result = await res.json();
  return result.message;
}

