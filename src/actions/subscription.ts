"use server";

import { getSession } from "@/services/auth/session";
import { supabase } from "@/services/supabase/client";

export type SubscriptionStatus = {
  isActive: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean; // <= 3 days
  daysRemaining: number;
  planName: string | null;
  error?: string;
};

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const session = await getSession();
  
  if (!session || !session.company_lic) {
    return { isActive: false, isExpired: true, isExpiringSoon: false, daysRemaining: 0, planName: null, error: "Unauthorized" };
  }

  try {
    // Fetch all plans for the company that are NOT "Storage" 
    // (since Storage is an add-on and doesn't dictate core software access)
    const { data: plans, error } = await supabase
      .from("plan")
      .select("plan, end_date")
      .eq("company_lic", session.company_lic)
      .in("plan", ["Basic", "Advance"])
      .order("end_date", { ascending: false }); // get latest end_date first

    if (error || !plans || plans.length === 0) {
      // No plan ever purchased
      return { isActive: false, isExpired: true, isExpiringSoon: false, daysRemaining: 0, planName: null };
    }

    // Get the most recent plan
    const latestPlan = plans[0];
    const planName = latestPlan.plan;
    
    // Calculate days remaining
    const endDate = new Date(latestPlan.end_date);
    const today = new Date();
    
    // Reset time components for accurate day calculation
    endDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      // Expired
      return { isActive: false, isExpired: true, isExpiringSoon: false, daysRemaining, planName };
    } else if (daysRemaining <= 3) {
      // Expiring soon (3 days or less)
      return { isActive: true, isExpired: false, isExpiringSoon: true, daysRemaining, planName };
    } else {
      // Fully Active
      return { isActive: true, isExpired: false, isExpiringSoon: false, daysRemaining, planName };
    }

  } catch (err) {
    console.error("Error fetching subscription:", err);
    return { isActive: false, isExpired: true, isExpiringSoon: false, daysRemaining: 0, planName: null, error: "Unexpected error" };
  }
}
