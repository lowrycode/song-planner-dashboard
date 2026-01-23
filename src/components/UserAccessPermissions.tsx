import type {
  UserAccesses,
  AccessItem,
  Network,
  Church,
  ChurchActivity,
  Scope,
  AccessGroup,
} from "../types/users";

import AccessGroupPanel from "./AccessGroupPanel";

interface UserAccessPermissionsProps {
  accesses: UserAccesses;
  network: Network | undefined;
  networkChurches: Church[] | null;
  networkChurchesLoading: boolean;
  networkChurchesError: string | null;
  churchActivities: ChurchActivity[];
  churchActivitiesLoading: boolean;
  churchActivitiesError: string | null;
  newSelections: Record<AccessGroup, number | "">;
  editMode: boolean;
  accessMutationLoading: boolean;
  accessPanelError: string | null;
  handleAddAccess: (group: AccessGroup, id: number | "") => void;
  handleDeleteAccess: (group: AccessGroup, id: number | "") => void;
  handleSelectChange: (group: AccessGroup, value: number | "") => void;
}

export default function UserAccessPermissions({
  accesses,
  network,
  networkChurches,
  networkChurchesLoading,
  networkChurchesError,
  churchActivities,
  churchActivitiesLoading,
  churchActivitiesError,
  newSelections,
  editMode,
  accessMutationLoading,
  accessPanelError,
  handleAddAccess,
  handleDeleteAccess,
  handleSelectChange,
}: UserAccessPermissionsProps) {
  return (
    <>
      <div className="flex w-full flex-wrap gap-5 items-center mb-5">
        {/* Panel Heading */}
        <h2 className="whitespace-nowrap text-lg font-bold text-gray-500">
          Access Permissions
        </h2>
        {/* Error message */}
        {accessPanelError && (
          <div className="text-sm text-red-600">{accessPanelError}</div>
        )}
      </div>
      <div className="flex flex-1 flex-wrap justify-around gap-5">
        {(Object.entries(accesses) as [AccessGroup, AccessItem[]][]).map(
          ([group, items]) => {
            let options: Scope[] = [];
            let optionsLoading = false;
            let optionsError: string | null = null;
            let placeholder: string = "-- Select an option --";

            switch (group) {
              case "networks":
                options = network ? [network] : [];
                placeholder = "-- Select a network --";
                break;

              case "churches":
                options = networkChurches ?? [];
                optionsLoading = networkChurchesLoading;
                optionsError = networkChurchesError;
                placeholder = "-- Select a church --";
                break;

              case "church_activities":
                options = churchActivities;
                optionsLoading = churchActivitiesLoading;
                optionsError = churchActivitiesError;
                placeholder = "-- Select a church activity --"
                break;
            }

            const isLoadingGroup = optionsLoading || accessMutationLoading;

            return (
              <AccessGroupPanel
                key={group}
                group={group}
                items={items}
                editMode={editMode}
                isLoadingGroup={isLoadingGroup}
                newSelection={newSelections[group]}
                options={options}
                optionsLoading={optionsLoading}
                optionsError={optionsError}
                placeholder={placeholder}
                handleSelectChange={handleSelectChange}
                handleAddAccess={handleAddAccess}
                handleDeleteAccess={handleDeleteAccess}
              />
            );
          },
        )}
      </div>
    </>
  );
}
