"use server";

import { getSession } from "@/services/auth/session";
import { supabase } from "@/services/supabase/client";

export async function getTemplates(type: 'ticksheet' | 'form') {
  const session = await getSession();
  if (!session || !session.company_lic) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  const table = type === 'ticksheet' ? 'ticksheet_templates' : 'form_templates';

  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("company_lic", session.company_lic)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error(`Error fetching ${type} templates:`, err);
    return { success: false, error: err.message || "Failed to fetch templates", data: [] };
  }
}

export async function saveTemplate(type: 'ticksheet' | 'form', id: string | null, payload: any) {
  const session = await getSession();
  if (!session || !session.company_lic) {
    return { success: false, error: "Unauthorized" };
  }

  const table = type === 'ticksheet' ? 'ticksheet_templates' : 'form_templates';

  const record = {
    company_lic: session.company_lic,
    title: payload.title,
    status: payload.status || 'Draft',
    schedule: payload.schedule || {},
    schema: payload.schema || [],
  };

  try {
    if (id) {
      // Update existing
      const { error } = await supabase
        .from(table)
        .update(record)
        .eq("id", id)
        .eq("company_lic", session.company_lic);
      
      if (error) throw error;
      return { success: true, id };
    } else {
      // Create new
      const { data, error } = await supabase
        .from(table)
        .insert({
          ...record,
          created_by: session.id,
          access_type: 'restricted',
          access_list: { departments: [], branches: [], users: [], isPublic: false }
        })
        .select('id')
        .single();
      
      if (error) throw error;
      return { success: true, id: data.id };
    }
  } catch (err: any) {
    console.error(`Error saving ${type} template:`, err);
    return { success: false, error: err.message || "Failed to save template" };
  }
}

export async function getTemplateById(type: 'ticksheet' | 'form', id: string) {
  const session = await getSession();
  if (!session || !session.company_lic) return { success: false, error: "Unauthorized", data: null };

  const table = type === 'ticksheet' ? 'ticksheet_templates' : 'form_templates';

  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .eq("company_lic", session.company_lic)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message, data: null };
  }
}

export async function deleteTemplate(type: 'ticksheet' | 'form', id: string) {
  const session = await getSession();
  if (!session || !session.company_lic) return { success: false, error: "Unauthorized" };
  if (session.role !== "Leader" && session.role !== "Co Leader") return { success: false, error: "Forbidden" };

  const table = type === 'ticksheet' ? 'ticksheet_templates' : 'form_templates';

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .eq("company_lic", session.company_lic);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function duplicateTemplate(type: 'ticksheet' | 'form', id: string) {
  const session = await getSession();
  if (!session || !session.company_lic) return { success: false, error: "Unauthorized" };

  const table = type === 'ticksheet' ? 'ticksheet_templates' : 'form_templates';

  try {
    // 1. Fetch original
    const { data: original, error: fetchErr } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .eq("company_lic", session.company_lic)
      .single();

    if (fetchErr) throw fetchErr;

    // 2. Insert copy
    const { id: oldId, created_at, ...copyData } = original;
    copyData.title = `${copyData.title} (Copy)`;
    copyData.created_by = session.id;

    const { error: insertErr } = await supabase
      .from(table)
      .insert(copyData);

    if (insertErr) throw insertErr;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAccessList(type: 'ticksheet' | 'form', id: string, accessType: string, accessList: any) {
  const session = await getSession();
  if (!session || !session.company_lic) return { success: false, error: "Unauthorized" };

  const table = type === 'ticksheet' ? 'ticksheet_templates' : 'form_templates';

  try {
    const { error } = await supabase
      .from(table)
      .update({
        access_type: accessType,
        access_list: accessList
      })
      .eq("id", id)
      .eq("company_lic", session.company_lic);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
