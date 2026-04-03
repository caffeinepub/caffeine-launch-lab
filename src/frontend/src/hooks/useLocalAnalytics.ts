// localStorage-based visitor analytics
// Key: aitoolsprox_analytics
// Tracks: totalVisitors, pageViews, returningVisitors, dailyVisits

const STORAGE_KEY = "aitoolsprox_analytics";
const VISITOR_ID_KEY = "aitoolsprox_vid";

interface AnalyticsData {
  totalVisitors: number;
  pageViews: number;
  returningVisitors: number;
  dailyVisits: Record<string, number>; // YYYY-MM-DD -> count
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadData(): AnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AnalyticsData;
  } catch {
    // ignore parse errors
  }
  return {
    totalVisitors: 0,
    pageViews: 0,
    returningVisitors: 0,
    dailyVisits: {},
  };
}

function saveData(data: AnalyticsData): void {
  try {
    // Prune daily entries older than 30 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffKey = cutoff.toISOString().slice(0, 10);
    for (const key of Object.keys(data.dailyVisits)) {
      if (key < cutoffKey) delete data.dailyVisits[key];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function recordVisit(): void {
  const data = loadData();
  const today = getTodayKey();
  const existingId = localStorage.getItem(VISITOR_ID_KEY);

  // Always increment page views
  data.pageViews += 1;

  // Increment daily visits
  data.dailyVisits[today] = (data.dailyVisits[today] ?? 0) + 1;

  if (!existingId) {
    // New visitor
    data.totalVisitors += 1;
    localStorage.setItem(
      VISITOR_ID_KEY,
      `vid_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    );
  } else {
    // Returning visitor (only count once per calendar day)
    const returnKey = `aitoolsprox_returned_${today}`;
    if (!sessionStorage.getItem(returnKey)) {
      data.returningVisitors += 1;
      sessionStorage.setItem(returnKey, "1");
    }
  }

  saveData(data);
}

export function getAnalytics() {
  const data = loadData();
  const today = getTodayKey();

  // Visitors today
  const visitorsToday = data.dailyVisits[today] ?? 0;

  // Visitors this week (last 7 days)
  let visitorsThisWeek = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    visitorsThisWeek += data.dailyVisits[key] ?? 0;
  }

  // Daily data for chart (last 7 days)
  const dailyChartData: { day: string; besucher: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("de-DE", { weekday: "short" });
    dailyChartData.push({ day: label, besucher: data.dailyVisits[key] ?? 0 });
  }

  return {
    totalVisitors: data.totalVisitors,
    visitorsToday,
    visitorsThisWeek,
    pageViews: data.pageViews,
    returningVisitors: data.returningVisitors,
    dailyChartData,
  };
}
