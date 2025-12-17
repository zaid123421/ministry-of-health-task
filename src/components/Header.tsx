import { MdKeyboardArrowDown } from "react-icons/md";
import avatar from "../assets/avatar.webp";

export default function Header() {
  
  return (
    <header
      className={`h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 transition-all duration-300`}
    >
      <div>
        <h1 className="text-xl font-bold text-[#05070A] hidden sm:block">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-3 cursor-pointer group">

          <div className="relative">
            <img
              src={avatar}
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-[#6339F9] duration-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="text-right hidden md:block">
            <h2 className="text-sm font-bold text-[#05070A] leading-none">John Admin</h2>
            <p className="text-[11px] text-gray-500 font-normal mt-1">admin@company.com</p>
          </div>

          <MdKeyboardArrowDown className="text-gray-400 group-hover:text-[#6339F9] duration-200 text-xl" />
        </div>
        
      </div>
    </header>
  );
}