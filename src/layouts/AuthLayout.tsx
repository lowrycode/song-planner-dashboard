import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex h-screen text-base overflow-y-scroll">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
