export type OrgPlan = "FREE" | "PRO" | "ENTERPRISE" | string | null | undefined;

export function isFreePlan(plan: OrgPlan): boolean {
  return plan === "FREE" || !plan;
}

export function maxShiftCountForPlan(plan: OrgPlan): number {
  return isFreePlan(plan) ? 2 : 12;
}

export function canUseMultiShiftEnrollment(plan: OrgPlan): boolean {
  return !isFreePlan(plan);
}
