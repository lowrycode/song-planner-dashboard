import type { UserRole } from "../types/users.ts";

export const UserRoleLabels: Record<UserRole, string> = {
  0: "Unapproved",
  1: "Normal",
  2: "Editor",
  3: "Admin",
};
