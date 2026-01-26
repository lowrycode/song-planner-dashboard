import { GiHamburgerMenu } from "react-icons/gi";

interface MobileTopBarProps {
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


function MobileTopBar({ setMobileOpen }: MobileTopBarProps) {
  return (
    <div className="flex justify-between bg-gray-900 w-full md:hidden text-xl p-4">
      <img src="/images/ccnetwork_logo.png" alt="CCN logo" className="w-36" />
      <button
        className="text-gray-400 hover:text-white"
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label="Open menu"
      >
        <GiHamburgerMenu />
      </button>
    </div>
  );
}

export default MobileTopBar;
