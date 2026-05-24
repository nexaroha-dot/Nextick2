"use server";

import { supabase } from "@/services/supabase/client";
import { createSession, destroySession } from "@/services/auth/session";

export async function loginUser(prevState: any, formData: FormData) {
  const licenseNo = formData.get("licenseNo") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!licenseNo || !username || !password) {
    return { error: "Please fill in all fields" };
  }

  try {
    // 1. Check company_lic table first for the License Number
    const { data: companyData, error: companyError } = await supabase
      .from("company_lic")
      .select("id, licno, lusername, lpwd")
      .eq("licno", licenseNo)
      .single();

    if (companyError || !companyData) {
      return { error: "Invalid License Number" };
    }

    // 2. Check if the user is the Leader (matches company_lic credentials exactly)
    if (companyData.lusername === username && companyData.lpwd === password) {
      // Leader login success
      await createSession({
        id: companyData.id,
        company_lic: companyData.id,
        role: "Leader",
        username: companyData.lusername,
      });
      return { success: true };
    }

    // 3. If not Leader, check the `users` table for a Member of this company
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, username, pwd, role, status")
      .eq("company_lic", companyData.id)
      .eq("username", username)
      .eq("pwd", password)
      .single();

    if (userError || !userData) {
      return { error: "Invalid Username or Password" };
    }

    if (userData.status === "inactive") {
      return { error: "This account has been deactivated" };
    }

    // Member login success
    await createSession({
      id: userData.id,
      company_lic: companyData.id,
      role: userData.role === "Member" ? "Member" : "Leader", // fallback depending on DB setup
      username: userData.username,
    });
    
    return { success: true };

  } catch (error: any) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred during login. Please try again later." };
  }
}

export async function logoutUser() {
  await destroySession();
}
