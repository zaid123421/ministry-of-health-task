import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MOCK_ADMIN = {
    email: "admin@company.com",
    password: "admin123",
    token: "mock-jwt-token-12345"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        localStorage.setItem("token", MOCK_ADMIN.token);
        login();
        navigate("/products");
      } else {
        setError("Invalid email or password");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#FDFDFD]">
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-[450px] flex flex-col items-center border border-gray-50">
        
        <div className="w-16 h-16 bg-gradient-to-br from-[#6339F9] to-[#A67EFB] rounded-2xl flex justify-center items-center shadow-lg shadow-purple-200 mb-6">
          <span className="text-white font-bold text-xl">Comp</span>
        </div>

        <h1 className="text-[1.75rem] font-bold text-[#05070A]">Welcome Back</h1>
        <p className="text-gray-400 mt-1 mb-8 text-sm font-medium">
          Sign in to access your admin dashboard
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-[11px] mb-4 text-center font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-bold text-[#05070A] mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FCFCFD] border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#6339F9] focus:ring-1 focus:ring-[#6339F9] transition-all text-sm"
              required
            />
          </div>

          <div className="mb-2 relative">
            <label className="block text-sm font-bold text-[#05070A] mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FCFCFD] border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#6339F9] focus:ring-1 focus:ring-[#6339F9] transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mb-8 ml-1 font-medium">
            Demo credentials: <span className="text-gray-500">admin@company.com / admin123</span>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-[#6339F9] to-[#8E63FB] text-white py-2 rounded-xl font-bold shadow-lg shadow-purple-100 hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}