import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import type { Activity, HeaderFilter } from "../types/dashboard";
import HeaderOverview from "../components/HeaderOverview";
import { useAuthFetch } from "../hooks/useAuthFetch";

// Helper functions
function oneYearAgoISO(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().split("T")[0];
}

export default function SongLayout() {
  // States
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [filtersReady, setFiltersReady] = useState(false);
  const [headerFilters, setHeaderFilters] = useState<HeaderFilter>({
    from_date: "",
    to_date: "",
    church_activities: [] as string[],
  });

  const authFetch = useAuthFetch();

  // Fetch activities once on pageload (based on user permission)
  useEffect(() => {
    async function fetchActivities() {
      setActivitiesLoading(true);
      setActivitiesError(null);

      try {
        const response = await authFetch("/activities");
        const data: Activity[] = await response.json();
        setActivities(data);
      } catch (err: any) {
        setActivitiesError(err.message);
      } finally {
        setActivitiesLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // Set header filters when activities fetched
  useEffect(() => {
    if (activities.length === 0) return;

    setHeaderFilters((prev) => ({
      ...prev,
      from_date: prev.from_date || oneYearAgoISO(),
      to_date: prev.to_date || new Date().toISOString().split("T")[0],
      church_activities:
        prev.church_activities.length === 0
          ? activities.map((a) => a.id.toString())
          : prev.church_activities,
    }));
  }, [activities]);

  // Set filtersReady to true when headerFilters updated
  useEffect(() => {
    if (
      headerFilters.from_date &&
      headerFilters.to_date &&
      headerFilters.church_activities.length > 0
    ) {
      setFiltersReady(true);
    }
  }, [headerFilters]);

  const selectedActivities = activities.filter((a) =>
    headerFilters.church_activities.includes(a.id.toString())
  );

  return (
    <>
      {/* Header */}
      <HeaderOverview
        activities={activities}
        activitiesLoading={activitiesLoading}
        activitiesError={activitiesError}
        headerFilters={headerFilters}
        setHeaderFilters={setHeaderFilters}
      />
      {/* Dashboard content */}
      <Outlet context={{ headerFilters, selectedActivities, filtersReady }} />
    </>
  );
}
