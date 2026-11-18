import type {PreviewState} from './model';

type Subscription = Pick<PreviewState, 'plan' | 'subscriptionStatus' | 'subscriptionPeriodEnd'>;

export function hasCurrentSubscription(state: Subscription, now = Date.now()): boolean {
  if (state.plan !== 'quarterly' && state.plan !== 'annual') return false;
  if (state.subscriptionStatus !== 'active' && state.subscriptionStatus !== 'cancelled') return false;
  if (state.subscriptionPeriodEnd == null) return state.subscriptionStatus === 'active';
  return Date.parse(state.subscriptionPeriodEnd) > now;
}

/** Calendar billing periods retain the time of purchase and clamp the day to the target month. */
function calendarPeriodEnd(now: number, months: number): string {
  const end = new Date(now);
  const day = end.getUTCDate();
  end.setUTCMonth(end.getUTCMonth() + months + 1, 0);
  end.setUTCDate(Math.min(day, end.getUTCDate()));
  return end.toISOString();
}

type LabUploadState = Pick<PreviewState, 'plan' | 'hasPurchasedLabPanel' | 'labUploadAccessUntil'>;

export function hasLabUploadAccess(state: LabUploadState, now = Date.now()): boolean {
  return (state.plan === 'full_panel' || state.hasPurchasedLabPanel === true) &&
    state.labUploadAccessUntil != null && Date.parse(state.labUploadAccessUntil) > now;
}

/** Legacy browser demos had a purchase flag but normally did not store its date. */
export function restoreLabUploadPeriod(state: PreviewState, now = Date.now()): PreviewState {
  if (state.labUploadAccessUntil !== undefined || (state.plan !== 'full_panel' && !state.hasPurchasedLabPanel)) return state;
  const sourceDate = (state.profile as {full_panel_purchased_at?: string}).full_panel_purchased_at;
  const recorded = [state.labPurchasedAt, sourceDate].find(date => date && Number.isFinite(Date.parse(date)));
  const start = recorded ? Date.parse(recorded) : now;
  return {...state, hasPurchasedLabPanel: true, labPurchasedAt: recorded, labUploadAccessUntil: calendarPeriodEnd(start, 12)};
}

export function labUploadPeriodNote(state: LabUploadState, now = Date.now()): string | null {
  if ((!state.hasPurchasedLabPanel && state.plan !== 'full_panel') || !state.labUploadAccessUntil) return null;
  const end = Date.parse(state.labUploadAccessUntil);
  if (!Number.isFinite(end)) return null;
  const label = periodDate.format(new Date(end));
  return end > now
    ? `Tu panel de laboratorio incluye subidas ilimitadas hasta el ${label}.`
    : `El año de subidas incluido con tu panel de laboratorio terminó el ${label}.`;
}

const periodDate = new Intl.DateTimeFormat('es', {dateStyle: 'long', timeStyle: 'short'});

export function purchasePreviewPlan(state: PreviewState, plan: 'quarterly' | 'full_panel', now = Date.now()): PreviewState {
  if (plan === 'full_panel') {
    const purchase = {hasPurchasedLabPanel: true, labPurchasedAt: new Date(now).toISOString(), labUploadAccessUntil: calendarPeriodEnd(now, 12)};
    if (state.plan !== 'free') return {...state, ...purchase};
    return {...state, ...purchase, plan, subscriptionStatus: 'active', subscriptionPeriodEnd: undefined,
      kitStep: 0, kitReportId: null, kitCycle: undefined};
  }

  if (state.plan === 'quarterly' && hasCurrentSubscription(state, now)) {
    return {...state, subscriptionStatus: 'active'};
  }
  return {...state, plan, subscriptionStatus: 'active', subscriptionPeriodEnd: calendarPeriodEnd(now, 3),
    hasPurchasedLabPanel: state.hasPurchasedLabPanel || state.plan === 'full_panel',
    kitStep: 0, kitReportId: null, kitCycle: {id:'demo-cycle-purchase',status:'scheduled',dueDate:null,trackingCode:null,extractionAt:null,version:1,reportId:null}};
}

export function changePreviewRenewal(state: PreviewState, status: 'active' | 'cancelled', now = Date.now()): PreviewState {
  if (state.plan !== 'quarterly' && state.plan !== 'annual') return state;
  if (status === 'cancelled') {
    // A pause or failed payment cannot turn into a paid period by cancelling.
    const unpaid = state.subscriptionStatus === 'paused' || state.subscriptionStatus === 'past_due';
    const futureEnd = state.subscriptionPeriodEnd && Date.parse(state.subscriptionPeriodEnd) > now;
    return {...state, subscriptionStatus: status, subscriptionPeriodEnd: unpaid && futureEnd ? undefined : state.subscriptionPeriodEnd};
  }
  if (state.plan === 'annual') return state;
  const validPeriod = state.subscriptionPeriodEnd != null && Date.parse(state.subscriptionPeriodEnd) > now;
  if (!validPeriod) return state;
  return {...state, subscriptionStatus: status};
}

export function subscriptionDetails(state: Subscription, now = Date.now()) {
  const end = state.subscriptionPeriodEnd == null ? NaN : Date.parse(state.subscriptionPeriodEnd);
  const hasAccess = hasCurrentSubscription(state, now);
  const hasFuturePeriod = end > now;
  const ended = Number.isFinite(end) && end <= now;
  const canRestoreRenewal = state.plan === 'quarterly' && hasFuturePeriod &&
    (state.subscriptionStatus === 'cancelled' || state.subscriptionStatus === 'paused');
  const canStartNewTerm = state.plan === 'quarterly' && !hasFuturePeriod &&
    (state.subscriptionStatus === 'cancelled' || state.subscriptionStatus === 'paused' || ended);
  let periodNote: string | null = null;
  if (hasAccess) {
    periodNote = Number.isFinite(end)
      ? `La suscripción incluye subidas ilimitadas hasta el ${periodDate.format(new Date(end))}.`
      : 'Puedes subir analíticas sin límite mientras la suscripción esté activa.';
  } else if (ended) {
    periodNote = 'El periodo pagado ha terminado.';
  }
  const statusLabel = state.subscriptionStatus === 'active' && ended ? 'Periodo finalizado'
    : state.subscriptionStatus === 'cancelled' && hasAccess ? 'Renovación cancelada' : null;
  return {canRestoreRenewal, canStartNewTerm, periodNote, statusLabel};
}
