import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = inputs;

    if (!email || !password || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem("manthan-user", JSON.stringify(res.data));
      toast.success("Signup Successfull!");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Signup Failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 flex items-center justify-center px-4">
      <div className="bg-[#0b0d0f] p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

        {/* Social Login */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition">
            <img
              src="https://brandlogo.org/wp-content/uploads/2025/05/Google-G-Icon-2025.png.webp"
              alt="Google"
              className="h-5 w-5"
            />
            Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="px-3 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 ring-accent"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 ring-accent"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputs.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 ring-accent pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-accent cursor-pointer underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;