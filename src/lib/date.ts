export function daysUntil(dateIso: string) {
  const target = new Date(dateIso);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
