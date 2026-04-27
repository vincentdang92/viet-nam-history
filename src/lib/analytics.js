import { logEvent } from 'firebase/analytics'
import { getFirebaseAnalytics } from './firebase'

async function track(eventName, params = {}) {
  try {
    const analytics = await getFirebaseAnalytics()
    if (!analytics) return
    logEvent(analytics, eventName, params)
  } catch {}
}

// ─── Game lifecycle ──────────────────────────────────────────────────────────

export const trackGameStart = () =>
  track('game_start', { timestamp: Date.now() })

export const trackGameOver = ({ reason, arc, yearsReigned, currentYear }) =>
  track('game_over', { reason, arc, years_reigned: yearsReigned, current_year: currentYear })

export const trackEndingReached = ({ endingId, arc, yearsReigned }) =>
  track('ending_reached', { ending_id: endingId, arc, years_reigned: yearsReigned })

export const trackArcComplete = ({ arc }) =>
  track('arc_complete', { arc })

// ─── Ad rescue ──────────────────────────────────────────────────────────────

export const trackAdRescueShown = ({ duration, bonus, triggerStat }) =>
  track('ad_rescue_shown', { duration, bonus, trigger_stat: triggerStat })

export const trackAdRescueWatched = ({ duration, bonus }) =>
  track('ad_rescue_watched', { duration, bonus })

export const trackAdRescueSkipped = ({ remaining }) =>
  track('ad_rescue_skipped', { seconds_remaining: remaining })

// ─── Errors / crashes ────────────────────────────────────────────────────────

export const trackError = ({ message, source }) =>
  track('app_error', { message: String(message).slice(0, 100), source })
