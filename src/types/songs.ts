// Song metric
export type SongMetric = "usage_count" | "first_used" | "last_used";

// Song data with usage
interface ActivityData {
  usage_count: number;
  first_used: string | null; // ISO date string or null
  last_used: string | null; // ISO date string or null
}

interface OverallData {
  usage_count: number;
  first_used: string | null;
  last_used: string | null;
}

export interface Song  {
  id: number;
  first_line: string;
  activities: Record<string, ActivityData>; // e.g. { newland: ActivityData, riverside: ActivityData, ... }
  overall: OverallData;
}
