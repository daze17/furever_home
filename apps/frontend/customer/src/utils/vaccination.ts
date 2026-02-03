export function getUpcomingVaccinations(
  vaccinations: { name: string; date: string }[],
): { name: string; date: string; daysUntil: number }[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return vaccinations
    .map((v) => {
      const vacDate = new Date(v.date);
      vacDate.setHours(0, 0, 0, 0);
      const daysUntil = Math.ceil(
        (vacDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return { name: v.name, date: v.date, daysUntil };
    })
    .filter((v) => v.daysUntil <= 7);
}

export function hasUpcomingVaccinations(
  vaccinations: { name: string; date: string }[],
): boolean {
  return getUpcomingVaccinations(vaccinations).length > 0;
}
