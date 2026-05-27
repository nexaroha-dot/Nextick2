import { getSubscriptionStatus } from "@/actions/subscription";
import SubscriptionLock from "@/components/shared/SubscriptionLock";

export default async function FormsLayout({ children }: { children: React.ReactNode }) {
  const subStatus = await getSubscriptionStatus();
  return <SubscriptionLock isExpired={subStatus.isExpired}>{children}</SubscriptionLock>;
}
