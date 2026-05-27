"use client";

import { AlertTriangle, Lock } from "lucide-react";
import { type SubscriptionStatus } from "@/actions/subscription";

export default function PlanBanner({ status }: { status: SubscriptionStatus }) {
  if (status.isActive && !status.isExpiringSoon) {
    // Fully active, no need to show banner
    return null;
  }

  if (status.isExpired) {
    return (
      <div className="w-full bg-red-600 dark:bg-red-900/80 text-white px-4 py-2.5 flex items-center justify-center shadow-md shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-center max-w-4xl mx-auto">
          <Lock className="w-4 h-4 shrink-0" />
          <p>
            Your {status.planName || "Subscription"} Plan has expired. The system is now in View-Only mode. Please contact administration to renew your license.
          </p>
        </div>
      </div>
    );
  }

  if (status.isExpiringSoon) {
    return (
      <div className="w-full bg-amber-500 dark:bg-amber-600/90 text-white px-4 py-2.5 flex items-center justify-center shadow-sm shrink-0">
        <div className="flex items-center gap-2 text-sm font-bold text-center max-w-4xl mx-auto tracking-wide">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p>
            Warning: Your {status.planName || "Software"} Plan will expire in {status.daysRemaining} {status.daysRemaining === 1 ? "day" : "days"}.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
