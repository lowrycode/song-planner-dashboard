import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import ExpandablePanel from "../components/ExpandablePanel.tsx";
import TableSortSearch from "../components/TableSortSearch.tsx";
import { authFetch } from "../utils/auth-fetch.ts";
import timeAgo from "../utils/time-ago.ts";
import { UserRoleLabels } from "../constants/user-role-labels.ts";
import type { UserWithAccesses } from "../types/users.ts";
import FadeLoader from "../components/FadeLoader.tsx";


interface FullName {
  display: string;
  hover: string;
  to: string;
}

interface ApprovedUser {
  id: number;
  full_name: FullName;
  network: string;
  church: string;
  role: string;
  scope: string;
}

interface UnapprovedUser {
  id: number;
  full_name: FullName;
  network: string;
  church: string;
  time_ago: string;
}

function processUsers(data: UserWithAccesses[]): [ApprovedUser[], UnapprovedUser[]] {
  const approved: ApprovedUser[] = [];
  const unapproved: UnapprovedUser[] = [];
  data.forEach((user) => {
    if (user.role < 1) {
      unapproved.push({
        id: user.id,
        full_name: {
          display: `${user.first_name} ${user.last_name}`,
          hover: "Edit user account details",
          to: `/admin/users/${user.id}`,
        },
        network: user.network?.name ?? "",
        church: user.church?.name ?? "",
        time_ago: timeAgo(user.created_at),
      });
    } else {
      const accesses = user.accesses;
      const netStrings = accesses.networks.map(
        (net) => `net:${net.network_slug}`,
      );
      const churchStrings = accesses.churches.map(
        (ch) => `ch:${ch.church_slug}`,
      );
      const activityStrings = accesses.church_activities.map(
        (act) => `act:${act.church_activity_slug}`,
      );

      const combined = [...netStrings, ...churchStrings, ...activityStrings];
      const accessString = combined.join(" ");

      approved.push({
        id: user.id,
        full_name: {
          display: `${user.first_name} ${user.last_name}`,
          hover: "Edit user account details",
          to: `/admin/users/${user.id}`,
        },
        network: user.network?.name ?? "",
        church: user.church?.name ?? "",
        role: UserRoleLabels[user.role],
        scope: accessString,
      });
    }
  });
  return [approved, unapproved];
}

export default function AdminManageUsersPage() {
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState<UnapprovedUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();
  const networkId = user?.network.id;

  // Fetch users within admin scope (same network)
  useEffect(() => {
    setLoading(true);
    setError(null);
    async function getNetworkUsers(networkId: number) {
      try {
        const res = await authFetch(`/networks/${networkId}/users`);
        if (!res.ok) throw new Error("Failed to fetch network users");
        const data = await res.json();
        const [approved, unapproved] = processUsers(data);
        setApprovedUsers(approved);
        setUnapprovedUsers(unapproved);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (networkId) {
      getNetworkUsers(networkId);
    }
  }, [networkId]);

  // Build approvedUsers and unapprovedUsers

  const headerMapUnapproved = {
    full_name: "Name",
    network: "Network",
    church: "Church",
    time_ago: "Registered",
  };

  const headerMapApproved = {
    full_name: "Name",
    network: "Network",
    church: "Church",
    role: "Role",
    scope: "Access",
  };

  return (
    <div className="flex flex-wrap gap-5 m-5">
      <ExpandablePanel
        title="Unapproved Users"
        recordCount={unapprovedUsers.length}
      >
        <FadeLoader loading={loading} error={error} minHeight="min-h-[10px]">
          <TableSortSearch
            data={unapprovedUsers}
            headerMap={headerMapUnapproved}
            searchKeys={Object.keys(headerMapUnapproved)}
            searchPlaceholder="Search any field.."
            textHeaders={Object.keys(headerMapUnapproved)}
            title=""
          />
        </FadeLoader>
      </ExpandablePanel>

      <ExpandablePanel
        title="Approved Users"
        recordCount={approvedUsers.length}
      >
        <FadeLoader loading={loading} error={error} minHeight="min-h-[10px]">
          <TableSortSearch
            data={approvedUsers}
            headerMap={headerMapApproved}
            searchKeys={Object.keys(headerMapApproved)}
            searchPlaceholder="Search any field.."
            textHeaders={Object.keys(headerMapApproved)}
            title=""
          />
        </FadeLoader>
      </ExpandablePanel>
    </div>
  );
}
