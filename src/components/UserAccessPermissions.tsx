import type {
  UserAccesses,
  AccessItem,
  Network,
  Church,
  ChurchActivity,
  AccessGroup,
} from "../types/users";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import AccessSelect from "./AccessSelect";
import FadeLoader from "./FadeLoader";

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
            const isLoadingGroup =
              (group === "churches" && networkChurchesLoading) ||
              (group === "church_activities" && churchActivitiesLoading);

            return (
              <div
                key={group}
                className="flex flex-col flex-1 border rounded border-gray-300 px-5 py-3"
              >
                {/* List access */}
                <div className="flex-1">
                  <div className="text-sm capitalize text-gray-500 mb-1">
                    {group}
                  </div>

                  <div className="flex flex-col flex-1 justify-between">
                    {items.length === 0 ? (
                      <div className="text-sm italic text-gray-400">None</div>
                    ) : (
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li
                            key={item.access_id}
                            className={`flex justify-between items-center gap-3 border
                                    px-3 py-1 min-w-48
                                    ${editMode ? "bg-white border-gray-200 " : "bg-gray-100 border-gray-100 "}`}
                          >
                            <span className="">{item.name}</span>

                            {editMode && (
                              <button
                                onClick={() =>
                                  handleDeleteAccess(group, item.access_id)
                                }
                                disabled={
                                  isLoadingGroup || accessMutationLoading
                                }
                                className="text-gray-400 hover:text-red-600 hover:cursor-pointer
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Add access */}
                {editMode && (
                  <div className="flex flex-wrap gap-2 text-sm mt-5">
                    {group === "networks" && network && (
                      <AccessSelect
                        value={newSelections[group] ?? ""}
                        placeholder="-- Select a network --"
                        options={[network]}
                        onChange={(value) => handleSelectChange(group, value)}
                      />
                    )}
                    {group === "churches" && networkChurches && (
                      <FadeLoader
                        loading={networkChurchesLoading}
                        error={networkChurchesError}
                      >
                        <AccessSelect
                          value={newSelections[group] ?? ""}
                          placeholder="-- Select a church --"
                          options={networkChurches}
                          onChange={(value) => handleSelectChange(group, value)}
                        />
                      </FadeLoader>
                    )}
                    {group === "church_activities" && (
                      <FadeLoader
                        loading={churchActivitiesLoading}
                        error={churchActivitiesError}
                      >
                        <AccessSelect
                          value={newSelections[group] ?? ""}
                          placeholder="-- Select a church activity --"
                          options={churchActivities}
                          onChange={(value) => handleSelectChange(group, value)}
                        />
                      </FadeLoader>
                    )}

                    {/* Button */}
                    <button
                      onClick={() =>
                        handleAddAccess(group, newSelections[group])
                      }
                      disabled={newSelections[group] === "" || isLoadingGroup}
                      className="flex items-center gap-2 rounded-lg text-gray-100 px-4 py-1 
                                shadow-md bg-purple-900 hover:bg-purple-700 hover:cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus />
                      Add
                    </button>
                  </div>
                )}
              </div>
            );
          },
        )}
      </div>
    </>
  );
}
