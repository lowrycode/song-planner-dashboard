export interface Activity {
  id: number;
  slug: string;
  name: string;
}

export interface HeaderFilter {
  from_date: string;
  to_date: string;
  church_activities: string[];
}

export interface DashboardContext {
  headerFilters: HeaderFilter;
  selectedActivities: Activity[];
  filtersReady: boolean;
}

