import { BASE_SYSTEM_PROMPT } from './base-system-prompt';
import { INVESTOR_RECOMMENDATION_GUIDE } from './investor-recommendations';

/**
 * Builds the full system prompt sent to the model.
 * - Base Wolfre behavior and safety rules
 * - Optional city-specific guidance
 * - Optional recent web context (from Tavily) when user asks for latest/today/current info
 * - Investor-profile guidance (retail / early investors, etc.)
 */
export function buildSystemPrompt(cityName?: string, latestContext?: string | null): string {
  const citySection = cityName
    ? `\n\nThe user is currently exploring ${cityName}. Tailor your answers to this city's real estate market when relevant.`
    : '';

  const recentInfoSection =
    latestContext && latestContext.trim().length > 0
      ? `\n\nRecent information from the web (use this to answer the user when relevant):\n\n${latestContext.trim()}`
      : '';

  return `${BASE_SYSTEM_PROMPT}${citySection}${recentInfoSection}\n\n${INVESTOR_RECOMMENDATION_GUIDE}`;
}

