import type { User } from "../types/users";
import { UserRoleLabels } from "../constants/user-role-labels";

type AccountDetailsInfoProps = {
  data: User;
};

type InfoItemProps = {
  label: string;
  value: string;
};

export default function AccountDetailsInfo({ data }: AccountDetailsInfoProps) {
  const firstName = data.first_name;
  const lastName = data.last_name;
  const username = data.username;
  const network = data.network.name;
  const church = data.church.name;
  const role = UserRoleLabels[data.role];


  return (
    <>
      <div className="flex w-full">
        <h2 className="whitespace-nowrap flex-1 lg:w-auto text-lg font-bold text-gray-500 h-8">
          Account Details
        </h2>
      </div>

      <div className="flex flex-1 justify-around flex-wrap gap-5">
        <InfoItem label="First Name" value={firstName} />
        <InfoItem label="Last Name" value={lastName} />
        <InfoItem label="Username" value={username} />
        <InfoItem label="Network" value={network} />
        <InfoItem label="Church" value={church} />
        <InfoItem label="Role" value={role} />
      </div>
    </>
  );
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="text-gray-500 text-sm mb-1">{label}</div>
        <span className="border border-gray-100 rounded px-2 py-1 min-w-32 text-center">{value}</span>
      </div>
    </>
  );
}
