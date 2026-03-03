import { UserRoleNumbersDict } from "../constants/user-role-labels.ts";


export function hasRequiredRole(
  userRoleLabel: keyof typeof UserRoleNumbersDict | undefined,
  requiredRoleLabel: keyof typeof UserRoleNumbersDict
): boolean {
  if (!userRoleLabel) return false;

  const userRoleNumber = UserRoleNumbersDict[userRoleLabel];
  const requiredRoleNumber = UserRoleNumbersDict[requiredRoleLabel];

  return userRoleNumber >= requiredRoleNumber;
}