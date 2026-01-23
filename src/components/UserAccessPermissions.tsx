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

interface UserAccessPermissionsProps {
  accesses: UserAccesses;
  network: Network | undefined;
  networkChurches: Church[] | null;
  churchActivities: ChurchActivity[];
  newSelections: Record<AccessGroup, number | "">;
  editMode: boolean;
  handleAddAccess: (group: AccessGroup, id: number | "") => void;
  handleDeleteAccess: (group: AccessGroup, id: number | "") => void;
  handleSelectChange: (group: AccessGroup, value: number | "") => void;
}

export default function UserAccessPermissions({
  accesses,
  network,
  networkChurches,
  churchActivities,
  newSelections,
  editMode,
  handleAddAccess,
  handleDeleteAccess,
  handleSelectChange,
}: UserAccessPermissionsProps) {
  /* --------------- STATE --------------- */

  return (
    <>
      <h2 className="whitespace-nowrap w-full text-lg font-bold text-gray-500">
        Access Permissions
      </h2>
      <div className="flex flex-1 flex-wrap justify-around gap-5">
        {(Object.entries(accesses) as [AccessGroup, AccessItem[]][]).map(
          ([group, items]) => (
            <div className="flex flex-col flex-1 border rounded border-gray-300 px-5 py-3">
              {/* List access */}
              <div key={group} className="flex-1">
                <div className="text-sm capitalize text-gray-500 mb-1">
                  {group}
                </div>

                <div className="flex flex-col flex-1 justify-between">
                  {items.length === 0 ? (
                    <div className="text-sm italic text-gray-400">None</div>
                  ) : (
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={item.access_id}
                          className={`flex justify-between items-center gap-3 border
                                    border-gray-200 px-3 py-1 min-w-48
                                    ${editMode ? "bg-white" : "bg-gray-100"}`}
                        >
                          <span className="">{item.name}</span>

                          {editMode && (
                            <button
                              onClick={() =>
                                handleDeleteAccess(group, item.access_id)
                              }
                              className="text-gray-400 hover:text-red-600 hover:cursor-pointer"
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
                    <AccessSelect
                      value={newSelections[group] ?? ""}
                      placeholder="-- Select a church --"
                      options={networkChurches}
                      onChange={(value) => handleSelectChange(group, value)}
                    />
                  )}
                  {group === "church_activities" && churchActivities && (
                    <AccessSelect
                      value={newSelections[group] ?? ""}
                      placeholder="-- Select a church activity --"
                      options={churchActivities}
                      onChange={(value) => handleSelectChange(group, value)}
                    />
                  )}
                  <button
                    onClick={() => handleAddAccess(group, newSelections[group])}
                    disabled={newSelections[group] === ""}
                    className="flex items-center gap-2 rounded-lg text-gray-100 px-4 py-1 shadow-md bg-purple-900 hover:bg-purple-700 hover:cursor-pointer"
                  >
                    <FaPlus />
                    Add
                  </button>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </>
  );
}
