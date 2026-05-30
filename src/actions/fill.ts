"use server";

import { getSession } from "@/services/auth/session";
import { supabase } from "@/services/supabase/client";

// Get user details to filter JSONB access lists
async function getCurrentUserContext() {
  const session = await getSession();
  if (!session) return null;

  if (session.role === "Leader" || session.role === "Co Leader") {
    // Leaders have access to everything
    return { session, isAdmin: true, depts: [], branches: [] };
  }

  // For members, fetch their assigned branches and departments
  const { data: userData } = await supabase
    .from("users")
    .select("department, branch")
    .eq("id", session.id)
    .single();

  return {
    session,
    isAdmin: false,
    depts: userData?.department || [],
    branches: userData?.branch || []
  };
}

export async function getAssignedTemplates(type: "ticksheet" | "form") {
  const ctx = await getCurrentUserContext();
  if (!ctx || !ctx.session.company_lic) return [];

  const table = type === "ticksheet" ? "ticksheet_templates" : "form_templates";

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("company_lic", ctx.session.company_lic)
    .eq("status", "Active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(`Error fetching assigned ${type}:`, error);
    return [];
  }

  // Filter based on access lists
  const assigned = data.filter((t) => {
    // Public or Admin can see everything active
    if (ctx.isAdmin || t.access_type === "public") return true;

    let access = { departments: [], branches: [], users: [] };
    if (t.access_list) {
      if (typeof t.access_list === 'string') {
        try { access = JSON.parse(t.access_list); } catch (e) {}
      } else {
        access = t.access_list;
      }
    }
    
    // Coerce everything to strings for bulletproof matching
    const myUid = String(ctx.session.id);
    const myDepts = ctx.depts.map(String);
    const myBranches = ctx.branches.map(String);

    // Check direct user assignment
    if (access.users && Array.isArray(access.users)) {
      if (access.users.some(uId => String(uId) === myUid)) return true;
    }

    // Check department assignment
    if (access.departments && Array.isArray(access.departments)) {
      if (access.departments.some(dId => myDepts.includes(String(dId)))) return true;
    }

    // Check branch assignment
    if (access.branches && Array.isArray(access.branches)) {
      if (access.branches.some(bId => myBranches.includes(String(bId)))) return true;
    }

    return false;
  });

  return assigned;
}

export async function getTemplateById(type: "ticksheet" | "form", id: string | number) {
  const session = await getSession();
  // Allow public access if no session, but we must verify it is actually public in DB
  // For now we assume if session is missing, they can only access if public.

  const table = type === "ticksheet" ? "ticksheet_templates" : "form_templates";

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { success: false, error: "Template not found" };
  }

  if (data.status !== "Active") {
    return { success: false, error: "This form is no longer active" };
  }

  // Security check
  if (data.access_type !== "public") {
    if (!session || session.company_lic !== data.company_lic) {
      return { success: false, error: "Unauthorized" };
    }
    // (We could add strict dept/branch checking here too, but listing handles visibility mostly)
  }

  return { success: true, data };
}

export async function submitResponse(type: "ticksheet" | "form", templateId: number, responses: any) {
  const session = await getSession();
  
  // We need company_lic. If public and no session, we must fetch the template first to get company_lic.
  let company_lic = session?.company_lic;
  
  if (!company_lic) {
    const table = type === "ticksheet" ? "ticksheet_templates" : "form_templates";
    const { data } = await supabase.from(table).select("company_lic, access_type").eq("id", templateId).single();
    if (!data || data.access_type !== "public") {
      return { success: false, error: "Unauthorized submission" };
    }
    company_lic = data.company_lic;
  }

  const responseTable = type === "ticksheet" ? "ticksheet_responses" : "form_responses";

  const responderMeta = {
    role: session ? session.role : "Guest",
    username: session ? session.username : "Anonymous",
    timestamp: new Date().toISOString()
  };

  const { error } = await supabase
    .from(responseTable)
    .insert([{
      company_lic,
      template_id: templateId,
      responder_id: session?.id || null,
      responder_meta: responderMeta,
      responses: responses
    }]);

  if (error) {
    console.error("Failed to submit response:", error);
    return { success: false, error: "Failed to submit response" };
  }

  return { success: true };
}
