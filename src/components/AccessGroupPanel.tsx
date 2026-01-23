import type {
  AccessItem,
  AccessGroup,
  Scope
} from "../types/users";
import { FaTrash, FaPlus } from "react-icons/fa";
import AccessSelect from "./AccessSelect";
import FadeLoader from "./FadeLoader";

interface AccessGroupPanelProps {
  group: AccessGroup;
  items: AccessItem[];
  editMode: boolean;
  isLoadingGroup: boolean;
  newSelection: number | "";
  options: Scope[];
  optionsLoading: boolean;
  optionsError: string | null;
  placeholder: string;
  handleSelectChange: (group: AccessGroup, value: number | "") => void;
  handleAddAccess: (group: AccessGroup, id: number | "") => void;
  handleDeleteAccess: (group: AccessGroup, id: number | "") => void;
}

export default function AccessGroupPanel({
  group,
  items,
  editMode,
  isLoadingGroup,
  newSelection,
  options,
  optionsLoading,
  optionsError,
  placeholder,
  handleSelectChange,
  handleAddAccess,
  handleDeleteAccess,
}: AccessGroupPanelProps) {
  return (
    <div className="flex flex-col flex-1 border rounded border-gray-300 px-5 py-3">
      {/* List access */}
      <div className="flex-1">
        <div className="text-sm capitalize text-gray-500 mb-1">{group}</div>

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
                    ${editMode ? "bg-white border-gray-200" : "bg-gray-100 border-gray-100"}`}
                >
                  <span>{item.name}</span>

                  {/* Remove access */}
                  {editMode && (
                    <button
                      onClick={() => handleDeleteAccess(group, item.access_id)}
                      disabled={isLoadingGroup}
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

      {/* Add access select */}
      {editMode && (
        <div className="flex flex-wrap gap-2 text-sm mt-5">
          <FadeLoader loading={optionsLoading} error={optionsError}>
            <AccessSelect
              value={newSelection}
              placeholder={placeholder}
              options={options}
              onChange={(value) => handleSelectChange(group, value)}
            />
          </FadeLoader>

          <button
            onClick={() => handleAddAccess(group, newSelection)}
            disabled={newSelection === "" || isLoadingGroup}
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
}
