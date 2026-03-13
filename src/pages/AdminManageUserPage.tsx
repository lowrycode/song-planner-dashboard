import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { useAuthFetch } from "../hooks/useAuthFetch";
import type {
  User,
  Church,
  UserAccesses,
  ChurchActivity,
  AccessGroup,
} from "../types/users";
import DashboardPanel from "../components/DashboardPanel";
import SliderSwitch from "../components/SliderSwitch";
import AccountDetailsForm from "../components/AccountDetailsForm";
import AccountDetailsInfo from "../components/AccountDetailsInfo";
import FadeLoader from "../components/FadeLoader";
import UserAccessPermissions from "../components/UserAccessPermissions.tsx";
import ResetPasswordForm from "../components/ResetPasswordForm";
import DeleteUserForm from "../components/DeleteUserForm";
import DeleteUserModal from "../components/DeleteUserModal";

type UpdateUserPayload = {
  username: string;
  first_name: string;
  last_name: string;
  role?: number;
  network_id?: number;
  church_id?: number;
};

export default function AdminManageUserPage() {
  const navigate = useNavigate();
  
  /* --------------- Users --------------- */
  // User
  const { userId } = useParams<{ userId: string }>();
  const userIdNum = Number(userId);

  // Current authenticated user
  const { user } = useAuth();
  const network = user?.network;

  // Guard against invalid user IDs
  if (!userIdNum || Number.isNaN(userIdNum)) {
    return <p>Invalid user ID</p>;
  }

  /* --------------- STATE --------------- */
  // Get user details state
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState<boolean>(true);

  // Get network churches state
  const [networkChurches, setNetworkChurches] = useState<Church[] | null>(null);
  const [networkChurchesError, setNetworkChurchesError] = useState<
    string | null
  >(null);
  const [networkChurchesLoading, setNetworkChurchesLoading] =
    useState<boolean>(true);

  // Get church activities state
  const [churchActivities, setChurchActivities] = useState<ChurchActivity[]>(
    [],
  );
  const [churchActivitiesLoading, setChurchActivitiesLoading] = useState(true);
  const [churchActivitiesError, setChurchActivitiesError] = useState<
    string | null
  >(null);

  // Get user accesses state
  const [accesses, setAccesses] = useState<UserAccesses | null>(null);
  const [accessesError, setAccessesError] = useState<string | null>(null);
  const [accessesLoading, setAccessesLoading] = useState<boolean>(true);

  // Update user details
  const [updateDetailsLoading, setUpdateDetailsLoading] = useState(false);
  const [updateDetailsError, setUpdateDetailsError] = useState<string | null>(
    null,
  );

  // Add access
  const [updateAccessesLoading, setUpdateAccessesLoading] = useState(false);
  const [updateAccessesError, setUpdateAccessesError] = useState<string | null>(
    null,
  );

  // Delete access
  const [deleteAccessLoading, setDeleteAccessLoading] = useState(false);
  const [deleteAccessError, setDeleteAccessError] = useState<string | null>(
    null,
  );

  // Edit mode
  const [editMode, setEditMode] = useState(false);

  // Access select box values
  const [newSelections, setNewSelections] = useState<
    Record<AccessGroup, number | "">
  >({
    networks: network ? network.id : "",
    churches: "",
    church_activities: "",
  });

  // Reset password
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null,
  );
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<
    string | null
  >(null);

  // Delete user
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState<string | null>(null);
  const [deleteUserSuccess, setDeleteUserSuccess] = useState<string | null>(
    null,
  );

  /* --------------- COMBINED STATE --------------- */
  const accountLoading = userDetailsLoading || networkChurchesLoading;
  const accountError = userDetailsError || networkChurchesError;
  const accessMutationLoading = updateAccessesLoading || deleteAccessLoading;
  const accessPanelError =
    updateAccessesError ||
    deleteAccessError ||
    networkChurchesError ||
    churchActivitiesError;

  const authFetch = useAuthFetch();

  /* --------------- EFFECTS --------------- */
  // Get User Details
  useEffect(() => {
    setUserDetailsLoading(true);
    setUserDetailsError(null);

    async function getUserDetails(userIdNum: number) {
      try {
        const res = await authFetch(`/users/${userIdNum}`);
        const data = await res.json();
        setUserDetails(data);
      } catch (err: any) {
        setUserDetailsError(err.message);
      } finally {
        setUserDetailsLoading(false);
      }
    }

    getUserDetails(userIdNum);
  }, [userId]);

  // Get User Access Details
  useEffect(() => {
    setAccessesLoading(true);
    setAccessesError(null);

    async function getUserAccesses(userIdNum: number) {
      try {
        const res = await authFetch(`/users/${userIdNum}/access`);
        const data = await res.json();
        setAccesses(data);
      } catch (err: any) {
        setAccessesError(err.message);
      } finally {
        setAccessesLoading(false);
      }
    }

    getUserAccesses(userIdNum);
  }, [userId]);

  // Get Admin Network Churches
  useEffect(() => {
    setNetworkChurchesLoading(true);
    setNetworkChurchesError(null);

    async function getNetworkChurches(networkId: number) {
      try {
        const res = await authFetch(`/networks/${networkId}/churches`);
        const data = await res.json();
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

  // Get Admin Network Church Activities
  useEffect(() => {
    async function fetchChurchActivities(networkId: number) {
      setChurchActivitiesLoading(true);
      setChurchActivitiesError(null);
      try {
        const res = await authFetch(`/networks/${networkId}/activities`);
        const data = await res.json();
        setChurchActivities(data);
      } catch (err: any) {
        setChurchActivitiesError(err.message);
      } finally {
        setChurchActivitiesLoading(false);
      }
    }

    if (network) {
      fetchChurchActivities(network.id);
    }
  }, [network]);

  useEffect(() => {
    if (!resetPasswordSuccess) return;

    const timer = setTimeout(() => {
      setResetPasswordSuccess(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [resetPasswordSuccess]);

  /* --------------- HELPER FUNCTIONS --------------- */
  function getAccessUrl(group: AccessGroup, id: number | "") {
    let url = null;
    switch (group) {
      case "networks":
        url = `/users/${userIdNum}/access/networks/${id}`;
        break;
      case "churches":
        url = `/users/${userIdNum}/access/churches/${id}`;
        break;
      case "church_activities":
        url = `/users/${userIdNum}/access/activities/${id}`;
        break;
    }
    return url;
  }

  function clearAccessErrors() {
    setUpdateAccessesError(null);
    setDeleteAccessError(null);
  }

  function handleSelectChange(group: AccessGroup, value: number | "") {
    clearAccessErrors();
    setNewSelections((prev) => ({
      ...prev,
      [group]: value,
    }));
  }

  async function handleUpdateUser(data: UpdateUserPayload) {
    clearAccessErrors();
    setUpdateDetailsLoading(true);
    setUpdateDetailsError(null);
    try {
      const res = await authFetch(`/users/${userIdNum}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const updatedUser = await res.json();

      // Update UI with fresh data
      setUserDetails(updatedUser);
    } catch (err: any) {
      console.error(err);
      setUpdateDetailsError(err.message);
    } finally {
      setUpdateDetailsLoading(false);
    }
  }

  async function handleDeleteAccess(group: AccessGroup, id: number | "") {
    if (id === "") return;
    clearAccessErrors();
    setDeleteAccessLoading(true);
    setDeleteAccessError(null);

    let url = getAccessUrl(group, id);
    if (url === null) {
      setDeleteAccessError("Invalid access group");
      setDeleteAccessLoading(false);
      return;
    }

    try {
      await authFetch(url, { method: "DELETE" });

      // Refetch user accesses after success
      const updatedAccessesRes = await authFetch(`/users/${userIdNum}/access`);
      const updatedAccesses = await updatedAccessesRes.json();
      setAccesses(updatedAccesses);

      // Reset the selection for this group
      setNewSelections((prev) => ({ ...prev, [group]: "" }));
    } catch (error: any) {
      setDeleteAccessError(error.message);
    } finally {
      setDeleteAccessLoading(false);
    }
  }

  async function handleAddAccess(group: AccessGroup, id: number | "") {
    if (id === "") return;
    clearAccessErrors();
    setUpdateAccessesLoading(true);
    setUpdateAccessesError(null);

    let url = getAccessUrl(group, id);
    if (url === null) {
      setUpdateAccessesError("Invalid access group");
      setUpdateAccessesLoading(false);
      return;
    }

    try {
      await authFetch(url, { method: "POST" });

      // Refetch user accesses after success
      const updatedAccessesRes = await authFetch(`/users/${userIdNum}/access`);
      const updatedAccesses = await updatedAccessesRes.json();
      setAccesses(updatedAccesses);

      // Reset the selection for this group
      setNewSelections((prev) => ({ ...prev, [group]: "" }));
    } catch (error: any) {
      setUpdateAccessesError(error.message);
    } finally {
      setUpdateAccessesLoading(false);
    }
  }

  async function handleResetPassword(password: string) {
    setResetPasswordLoading(true);
    setResetPasswordError(null);
    setResetPasswordSuccess(null);
    try {
      const res = await authFetch(`/users/${userIdNum}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password }),
      });
      const data = await res.json();
      setResetPasswordSuccess(data.message || "Password updated successfully");
    } catch (err: any) {
      setResetPasswordError(err.message);
    } finally {
      setResetPasswordLoading(false);
    }
  }

  async function handleDeleteUser() {
    if (!userDetails) return;

    setDeleteUserLoading(true);
    setDeleteUserError(null);
    setDeleteUserSuccess(null);

    try {
      await authFetch(`/users/${userIdNum}`, { method: "DELETE" });

      setDeleteUserSuccess("User deleted successfully.");
      // Don't close modal here - let the modal handle it after showing success
    } catch (err: any) {
      setDeleteUserError(err.message || "Failed to delete user.");
      setShowDeleteModal(false); // close modal on error
    } finally {
      setDeleteUserLoading(false);
    }
  }

  function handleDeleteSuccess() {
    navigate("/admin/users", { replace: true });
  }

  const hasNoAccess =
    accesses && Object.values(accesses).every((arr) => arr.length === 0);

  return (
    <div className="flex flex-wrap gap-2 md:gap-4 my-4 mx-2 md:mx-3">
      {/* -- HEADER -- */}
      <DashboardPanel className="flex w-full justify-between items-center gap-5">
        {userDetails ? (
          <FadeLoader loading={accountLoading} error={accountError}>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <div className="flex flex-col sm:me-auto">
                <h2 className="whitespace-nowrap text-2xl font-extrabold text-purple-900">
                  {userDetails.first_name} {userDetails.last_name}
                </h2>
                <div className="flex-1 whitespace-nowrap text-sm text-gray-500 italic">
                  Registered on{" "}
                  {new Date(userDetails.created_at).toLocaleDateString()}
                </div>
              </div>
              {hasNoAccess && (
                <div className="flex flex-1 justify-center text-red-500 font-bold">
                  User has no access permissions
                </div>
              )}
              <SliderSwitch
                ariaLabel="Toggle Edit Mode"
                label="Edit"
                checked={editMode}
                setChecked={setEditMode}
              />
            </div>
          </FadeLoader>
        ) : (
          <p>Loading user details...</p>
        )}
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
                  submitting={updateDetailsLoading}
                  error={updateDetailsError}
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
        {accesses ? (
          <FadeLoader loading={accessesLoading} error={accessesError}>
            <UserAccessPermissions
              accesses={accesses}
              network={network}
              networkChurches={networkChurches}
              networkChurchesLoading={networkChurchesLoading}
              networkChurchesError={networkChurchesError}
              churchActivities={churchActivities}
              churchActivitiesLoading={churchActivitiesLoading}
              churchActivitiesError={churchActivitiesError}
              newSelections={newSelections}
              editMode={editMode}
              accessPanelError={accessPanelError}
              accessMutationLoading={accessMutationLoading}
              handleAddAccess={handleAddAccess}
              handleDeleteAccess={handleDeleteAccess}
              handleSelectChange={handleSelectChange}
            />
          </FadeLoader>
        ) : (
          <p>Loading user access details...</p>
        )}
      </DashboardPanel>

      {editMode && (
        <div className="flex flex-wrap flex-1 gap-3">
        {/* Change Password */}
          <DashboardPanel className="flex flex-1">
            <ResetPasswordForm
              onReset={handleResetPassword}
              loading={resetPasswordLoading}
              error={resetPasswordError}
              success={resetPasswordSuccess}
            />
          </DashboardPanel>

          {/* Delete User */}
          <DashboardPanel className="flex flex-1">
            <DeleteUserForm
              onDeleteClick={() => setShowDeleteModal(true)}
            />
          </DashboardPanel>
        </div>
      )}

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        user={userDetails}
        loading={deleteUserLoading}
        error={deleteUserError}
        success={deleteUserSuccess}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
