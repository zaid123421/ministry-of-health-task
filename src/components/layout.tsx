import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const MainLayout = () => {
  const { isSidebarCollapsed } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 min-w-0 ${
          isSidebarCollapsed ? "ml-[80px]" : "ml-[250px]"
        }`}
      >
        <Header />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;