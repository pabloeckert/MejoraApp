/**
 * useFeatureAccess — Hook para verificar acceso a features premium
 *
 * Retorna si el usuario tiene acceso a un feature y helpers
 * para tracking de intentos bloqueados.
 *
 * Uso:
 *   const { hasAccess, trackBlocked } = useFeatureAccess("diagnostic_history");
 *   if (!hasAccess) trackBlocked();
 */

import { useCallback } from "react";
import { hasFeature, type FeatureId, FEATURE_LABELS, PLAN_CONFIG, FEATURE_REQUIRED_LEVELS } from "@/lib/plans";
import { trackFunnelStep } from "@/lib/analytics";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { useAuth } from "@/contexts/AuthContext";

export function useFeatureAccess(featureId: FeatureId) {
  const { user } = useAuth();
  const { hasAccess: hasLevelAccess, isLoading } = useAccessLevel(user?.id);

  const isGlobalFree = hasFeature(featureId);
  const requiredLevel = FEATURE_REQUIRED_LEVELS[featureId] || "N1";
  const hasAccess = isGlobalFree || hasLevelAccess(requiredLevel);

  const trackBlocked = useCallback(() => {
    trackFunnelStep("feature_blocked", {
      feature: featureId,
      plan: PLAN_CONFIG.id,
    });
  }, [featureId]);

  const trackUpgradePromptShown = useCallback(() => {
    trackFunnelStep("upgrade_prompt_shown", {
      feature: featureId,
      plan: PLAN_CONFIG.id,
    });
  }, [featureId]);

  const info = FEATURE_LABELS[featureId];

  return {
    hasAccess: isLoading ? false : hasAccess,
    isLoading,
    trackBlocked,
    trackUpgradePromptShown,
    featureTitle: info?.title ?? featureId,
    featureDescription: info?.description ?? "",
  };
}
