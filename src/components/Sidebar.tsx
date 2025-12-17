import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import Confirm from "./Confirm";
import { MdArrowBackIos } from "react-icons/md";

import avatar from "../assets/avatar.webp";
import logoutImg from "../assets/logout.jpg";
import Loading from "./Loading";

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const [logutConfirmBox, setLogoutConfirmBox] = useState(false);

  const { logout, isSidebarCollapsed, toggleSidebar } = useContext(AuthContext); 
  const navigate = useNavigate();

  async function handleLogout() {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.removeItem("token");
      logout();
      navigate("/login");
    } catch (err) {
      console.log("Logout Error:", err);
    } finally {
      setIsLoading(false);
      setLogoutConfirmBox(false);
    }
  }

  return (
    <>
      <div className={`text-sm md:text-lg ${isSidebarCollapsed ? `w-[80px]` : 'w-[250px]'} text-white bg-[#05070A] h-screen flex flex-col items-center font-bold fixed top-0 z-50 transition-all duration-300 border-r border-white/5`}>
        
        <button
          onClick={toggleSidebar}
          className="absolute right-[-15px] top-[25px] text-white bg-[#6339F9] w-[30px] h-[30px] rounded-full flex justify-center items-center shadow-lg z-20 hover:scale-110 duration-200"
        >
          <MdArrowBackIos className={`text-xs transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180 ml-1' : ''}`} />
        </button>

        <div className={`flex items-center mb-2 w-full p-5 border-b border-gray-400 ${isSidebarCollapsed ? 'justify-center' : 'gap-4'}`}>
          <img src={avatar} className="w-[40px] h-[40px] rounded-full object-cover" alt="admin" />
          {!isSidebarCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="text-[18px] font-bold whitespace-nowrap">Admin</h1>
              <p className="text-[10px] text-gray-400 font-normal">Dashboard</p>
            </div>
          )}
        </div>

        <ul className={`p-3 w-full flex flex-col gap-2 ${isSidebarCollapsed ? 'items-center' : ''}`}>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center py-3 px-3 rounded-xl duration-300 ${
                isSidebarCollapsed ? 'w-[50px] justify-center' : 'w-full'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-[#6339F9] to-[#A67EFB] text-white shadow-lg shadow-purple-500/30' 
                  : 'text-[#8E9297] hover:bg-white/5'
              }`
            }
          >
            <MdOutlineProductionQuantityLimits className={`text-xl ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
            {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">Products</span>}
          </NavLink>
        </ul>

        <div className={`mt-auto p-3 w-full border-t border-white/5 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          <button
            className={`
              ${isSidebarCollapsed ? 'w-[50px] justify-center' : 'w-full'} 
              py-3 px-3 rounded-xl cursor-pointer flex items-center duration-300 text-[#8E9297]
              hover:bg-gradient-to-r hover:from-[#6339F9] hover:to-[#A67EFB] 
              hover:text-white hover:shadow-lg hover:shadow-purple-500/20
            `}
            onClick={() => setLogoutConfirmBox(true)}
          >
            <RiLogoutBoxRLine className={`text-xl ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
            {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {logutConfirmBox && (
        <Confirm
          img={logoutImg}
          label="Do you really want to logout?"
          onCancel={() => setLogoutConfirmBox(false)}
          onConfirm={handleLogout}
          confirmButtonName={isLoading ? "Logging out..." : "Logout"}
        />
      )}
      
      {isLoading && <Loading />}
    </>
  );
}