import { getToken } from "@/lib/auth";
import { Client } from "@/types/client";
import { DoctorSummary } from "@/types/doctor";
import { stringify } from "querystring";

export async function fetchProfile(): Promise<Client> {
    const token = getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/profile`,{
        headers: {Authorization: `Bearer ${token}`},
    })

    if(!res.ok) {
        throw new Error('Invalid token, failed to fetch client profile!')
    }

    return res.json();
}

export async function updateClientProfile(data: Partial<Client>, avatar?: File) {
    const token = getToken();
    if (!token) throw new Error("No token provided");
  
    const form = new FormData();
  
    const allowedFields: (keyof Client)[] = ["avatar", "name", "email", "password", "address", "phone", "dob"];
  
    for (const key of allowedFields) {
      const value = data[key];
      if (value !== undefined && value !== null) {
        if (key === "phone") {
          const phoneNum = Number(value);
          if (!isNaN(phoneNum)) {
            form.append("phone", phoneNum.toString());
          }
        } else {
          form.append(key, value.toString());
        }
      }
    }
  
    if (avatar) {
      form.append("avatar", avatar);
    }
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Update failed");
    }
  
    return res.json();
  }

