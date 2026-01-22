import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { authFetch } from "../utils/auth-fetch";
import type { User, Church } from "../types/users";
import DashboardPanel from "../components/DashboardPanel";
import SliderSwitch from "../components/SliderSwitch";
import AccountDetailsForm from "../components/AccountDetailsForm";
import AccountDetailsInfo from "../components/AccountDetailsInfo";
import FadeLoader from "../components/FadeLoader";

type UpdateUserPayload = {
  username: string;
  first_name: string;
  last_name: string;
  role?: number;
  network_id?: number;
  church_id?: number;
};

export default function AdminManageUserPage() {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState<boolean>(true);
  const [networkChurches, setNetworkChurches] = useState<Church[] | null>(null);
  const [networkChurchesError, setNetworkChurchesError] = useState<
    string | null
  >(null);
  const [networkChurchesLoading, setNetworkChurchesLoading] =
    useState<boolean>(true);
  const [userAccessDetails, setUserAccessDetails] = useState<User | null>(null);
  const [userAccessesError, setUserAccessesError] = useState<string | null>(
    null,
  );
  const [userAccessesLoading, setUserAccessesLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const { userId } = useParams<{ userId: string }>();
  const userIdNum = Number(userId);

  const { user } = useAuth();
  const network = user?.network;

  // Guard against invalid user IDs
  if (!userIdNum || Number.isNaN(userIdNum)) {
    return <p>Invalid user ID</p>;
  }

  // User Details
  useEffect(() => {
    setUserDetailsLoading(true);
    setUserDetailsError(null);

    async function getUserDetails(userIdNum: number) {
      try {
        const res = await authFetch(`/users/${userIdNum}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        console.log(data);
        setUserDetails(data);
      } catch (err: any) {
        setUserDetailsError(err.message);
      } finally {
        setUserDetailsLoading(false);
      }
    }

    getUserDetails(userIdNum);
  }, [userId]);

  // User Access Details
  useEffect(() => {
    setUserAccessesLoading(true);
    setUserAccessesError(null);

    async function getUserAccesses(userIdNum: number) {
      try {
        const res = await authFetch(`/users/${userIdNum}/access`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUserAccessDetails(data);
      } catch (err: any) {
        setUserAccessesError(err.message);
      } finally {
        setUserAccessesLoading(false);
      }
    }

    getUserAccesses(userIdNum);
  }, [userId]);

  // Admin Network Churches
  useEffect(() => {
    setNetworkChurchesLoading(true);
    setNetworkChurchesError(null);

    async function getNetworkChurches(networkId: number) {
      try {
        const res = await authFetch(`/networks/${networkId}/churches`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        console.log(data);
        setNetworkChurches(data);
      } catch (err: any) {
        setNetworkChurchesError(err.message);
      } finally {
        setNetworkChurchesLoading(false);
      }
    }

    if (network) {
      getNetworkChurches(network.id);
    }
  }, [network]);

  async function handleUpdateUser(data: UpdateUserPayload) {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const res = await authFetch(`/users/${userIdNum}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Failed to update user");
      }

      const updatedUser = await res.json();

      // Update UI with fresh data
      setUserDetails(updatedUser);
    } catch (err: any) {
      console.error(err);
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  }

  const accountLoading = userDetailsLoading || networkChurchesLoading;
  const accountError = userDetailsError || networkChurchesError;

  return (
    <div className="flex flex-wrap gap-5 m-5">
      {/* -- HEADER -- */}
      <DashboardPanel className="flex w-full justify-between items-center gap-5">
        {userDetails ? (
          <FadeLoader loading={accountLoading} error={accountError}>
            <div className="flex items-center gap-5">
              <h2 className="whitespace-nowrap text-2xl font-extrabold text-purple-900">
                {userDetails.first_name} {userDetails.last_name}
              </h2>
              <div className="text-sm text-gray-500 italic">
                Registered on{" "}
                {new Date(userDetails.created_at).toLocaleDateString()}
              </div>
            </div>
          </FadeLoader>
        ) : (
          <p>Loading user details...</p>
        )}
        <SliderSwitch
          ariaLabel="Toggle Edit Mode"
          label="Edit"
          checked={editMode}
          setChecked={setEditMode}
        />
      </DashboardPanel>
      {/* -- ACCOUNT DETAILS -- */}
      <DashboardPanel className="flex w-full flex-wrap gap-5">
        {userDetails && network && networkChurches ? (
          <FadeLoader
            loading={userDetailsLoading}
            error={userDetailsError}
            className="flex flex-1 justify-around flex-wrap gap-5"
          >
            {!userDetailsLoading &&
              userDetails &&
              (editMode ? (
                <AccountDetailsForm
                  initialData={userDetails}
                  adminNetworks={[network]}
                  networkChurches={networkChurches}
                  onSubmit={handleUpdateUser}
                  submitting={updateLoading}
                  error={updateError}
                />
              ) : (
                <AccountDetailsInfo data={userDetails} />
              ))}
          </FadeLoader>
        ) : (
          <p>Loading user details...</p>
        )}
        {/* </div> */}
      </DashboardPanel>
      {/* -- ACCESS PERMISSIONS -- */}
      <DashboardPanel className="flex flex-wrap items-start gap-x-15 gap-y-5">
        <h2 className="whitespace-nowrap w-full lg:w-auto text-lg font-bold text-gray-500">
          Access Permissions
        </h2>
        <div className="flex flex-1 justify-around">
          <p>Permissions here</p>
          {/* {Object.entries(userAccessDetails).map(([group, items]) => (
            <div key={group} className="mb-4">
              <div className="text-sm capitalize text-gray-500 mb-1">
                {group}
              </div>

              {items.length === 0 ? (
                <div className="text-sm italic text-gray-400">None</div>
              ) : (
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center gap-3"
                    >
                      <span>{item.name}</span>

                      {editMode && (
                        <button
                          onClick={() => handleDelete(group, item.id)}
                          className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))} */}
        </div>
      </DashboardPanel>
    </div>
  );
}
