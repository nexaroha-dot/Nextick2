"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/services/auth/session";
import { createSupabaseServerClient } from "@/services/supabase/client";

export async function getBranches() {
  const session = await getSession();
  if (!session || !session.company_lic) return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("branch")
    .select("*")
    .eq("company_lic", session.company_lic)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
  return data || [];
}

export async function addBranch(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !session.company_lic) {
    return { error: "Unauthorized access" };
  }

  const branchName = formData.get("branch")?.toString().trim();
  if (!branchName) {
    return { error: "Branch name is required" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("branch")
    .insert([
      {
        company_lic: session.company_lic,
        branch: branchName,
      },
    ]);

  if (error) {
    console.error("Error adding branch:", error);
    return { error: "Failed to add branch. Please try again." };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function getDepartments() {
  const session = await getSession();
  if (!session || !session.company_lic) return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("department")
    .select("*")
    .eq("company_lic", session.company_lic)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
  return data || [];
}

export async function addDepartment(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !session.company_lic) {
    return { error: "Unauthorized access" };
  }

  const departmentName = formData.get("department")?.toString().trim();
  if (!departmentName) {
    return { error: "Department name is required" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("department")
    .insert([
      {
        company_lic: session.company_lic,
        department: departmentName,
      },
    ]);

  if (error) {
    console.error("Error adding department:", error);
    return { error: "Failed to add department. Please try again." };
  }

  revalidatePath("/settings");
  return { success: true };
}
