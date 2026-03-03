import type { UserRole } from "../types/users.ts";

export const UserRoleLabelsDict: Record<UserRole, string> = {
  0: "Unapproved",
  1: "Normal",
  2: "Editor",
  3: "Admin",
};

// Dynamically populated from UserRoleLabelsDict
export const UserRoleNumbersDict = Object.fromEntries(
  Object.entries(UserRoleLabelsDict).map(([key, label]) => [
    label.toLowerCase(),
    Number(key) as UserRole,
  ])
) as Record<(typeof UserRoleLabelsDict)[UserRole], UserRole>;