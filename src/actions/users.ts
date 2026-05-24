"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/services/auth/session";
import { supabase } from "@/services/supabase/client";

export async function getCompanyUsers() {
  const session = await getSession();
  if (!session || !session.company_lic) return { users: [], error: "Unauthorized" };

  try {
    // 1. Fetch the absolute Leader from company_lic
    const { data: companyData, error: companyError } = await supabase
      .from("company_lic")
      .select("id, lusername, created_at")
      .eq("id", session.company_lic)
      .single();

    if (companyError || !companyData) {
      return { users: [], error: "Failed to fetch Leader" };
    }

    const leaderUser = {
      id: `leader-${companyData.id}`,
      name: "Main Leader", // fallback name since company_lic doesn't have a name field
      username: companyData.lusername,
      role: "Leader",
      status: "active",
      created_at: companyData.created_at,
      branch: [],
      department: [],
      isAbsoluteLeader: true // special flag to prevent editing the main leader
    };

    // 2. Fetch the rest of the users from the `users` table
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*")
      .eq("company_lic", session.company_lic)
      .order("created_at", { ascending: false });

    if (usersError) {
      return { users: [], error: "Failed to fetch users" };
    }

    // Map `users` table records
    const subordinateUsers = usersData.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      pwd: u.pwd, // fetched for editing
      role: u.role,
      status: u.status || "active",
      created_at: u.created_at,
      branch: u.branch || [],
      department: u.department || [],
      isAbsoluteLeader: false
    }));

    // Sort: Active users first, Unactive users at the bottom
    subordinateUsers.sort((a, b) => {
      if (a.status === "active" && b.status === "unactive") return -1;
      if (a.status === "unactive" && b.status === "active") return 1;
      return 0;
    });

    return { users: [leaderUser, ...subordinateUsers] };
  } catch (error) {
    console.error("Error fetching company users:", error);
    return { users: [], error: "Unexpected error occurred" };
  }
}

export async function addUser(
  prevState: any,
  formData: FormData,
  selectedBranches: number[],
  selectedDepartments: number[]
) {
  const session = await getSession();
  if (!session || !session.company_lic) {
    return { error: "Unauthorized access" };
  }

  // Only Leader and Co Leader can add
  if (session.role === "Member") {
    return { error: "Members cannot add users" };
  }

  const name = formData.get("name")?.toString().trim();
  const username = formData.get("username")?.toString().trim();
  const pwd = formData.get("pwd")?.toString().trim();
  let role = formData.get("role")?.toString().trim();

  if (!name || !username || !pwd) {
    return { error: "Name, Username, and Password are required" };
  }

  // Enforce role logic: Co Leaders can ONLY create Members
  if (session.role !== "Leader") {
    role = "Member";
  }
  
  if (!role) {
    role = "Member";
  }

  // Check username uniqueness
  const { data: compData } = await supabase.from("company_lic").select("id").eq("lusername", username).single();
  if (compData) return { error: "Username already exists (Leader)" };

  const { data: existingUser } = await supabase.from("users").select("id").eq("company_lic", session.company_lic).eq("username", username).single();
  if (existingUser) return { error: "Username already exists" };

  const { error } = await supabase.from("users").insert([{
    company_lic: session.company_lic,
    name: name,
    username: username,
    pwd: pwd,
    role: role,
    status: "active",
    branch: selectedBranches,
    department: selectedDepartments
  }]);

  if (error) {
    console.error("Error adding user:", error);
    return { error: "Failed to add user. Please try again." };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function editUser(
  prevState: any,
  formData: FormData,
  userId: number,
  selectedBranches: number[],
  selectedDepartments: number[]
) {
  const session = await getSession();
  if (!session || !session.company_lic || session.role === "Member") {
    return { error: "Unauthorized access" };
  }

  const name = formData.get("name")?.toString().trim();
  const username = formData.get("username")?.toString().trim();
  const pwd = formData.get("pwd")?.toString().trim();
  let role = formData.get("role")?.toString().trim();

  if (!name || !username || !pwd) {
    return { error: "Name, Username, and Password are required" };
  }

  // Co Leaders cannot change roles during edit
  if (session.role !== "Leader") {
    role = "Member";
  } else if (!role) {
    role = "Member";
  }

  // Check username uniqueness for other users
  const { data: compData } = await supabase.from("company_lic").select("id").eq("lusername", username).single();
  if (compData) return { error: "Username already exists (Leader)" };

  const { data: existingUser } = await supabase.from("users").select("id").eq("company_lic", session.company_lic).eq("username", username).single();
  if (existingUser && existingUser.id !== userId) return { error: "Username already exists" };

  const { error } = await supabase.from("users").update({
    name: name,
    username: username,
    pwd: pwd,
    role: role,
    branch: selectedBranches,
    department: selectedDepartments
  }).eq("id", userId).eq("company_lic", session.company_lic);

  if (error) {
    console.error("Error editing user:", error);
    return { error: "Failed to edit user. Please try again." };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function toggleUserStatus(userId: number, currentStatus: string) {
  const session = await getSession();
  if (!session || session.role !== "Leader") {
    return { error: "Only the Leader can change user status" };
  }

  const newStatus = currentStatus === "active" ? "unactive" : "active";

  const { error } = await supabase.from("users").update({ status: newStatus }).eq("id", userId).eq("company_lic", session.company_lic);

  if (error) {
    console.error("Error toggling status:", error);
    return { error: "Failed to update status" };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function changeUserRole(userId: number, newRole: string) {
  const session = await getSession();
  if (!session || session.role !== "Leader") {
    return { error: "Only the Leader can change roles" };
  }

  if (newRole !== "Co Leader" && newRole !== "Member") {
    return { error: "Invalid role selected" };
  }

  const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId).eq("company_lic", session.company_lic);

  if (error) {
    console.error("Error changing role:", error);
    return { error: "Failed to update role" };
  }

  revalidatePath("/settings/users");
  return { success: true };
}
