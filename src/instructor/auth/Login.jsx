import  { useEffect, useState } from 'react';
import login from "../images/login.png";
import logo from "../../icons/logo.svg";
import eye from "../../icons/Eye.svg";
import eyeSlash from "../../icons/EyeSlash.svg";
import google from "../../icons/google.svg";
import fb from "../../icons/fb.svg";
import apple from "../../icons/apple.svg";
import api from "../../api.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await api.post("/api/login/", {
        username: formData.username,
        password: formData.password,
      });
  
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
  
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role); // Save role to localStorage
      console.log("res.data.role",res.data.user.role)
      if(res.data.user.role=="student"){
        navigate("/student/dashboard");
      }
      else if(res.data.user.role=="instructor"){
        navigate("/instructor/dashboard");
        }
      else if(res.data.user.role=="admin"){
        navigate("/admin/dashboard");
      }
      // ✅ Navigate to student dashboard
      // navigate("/instructor/dashboard");  // or just "/student" if your route handles it
    } catch (err) {
      alert("Invalid credentials. Please try again.");
      console.error(err);
    }
  };
  

  useEffect(() => {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role"); // if you save roles separately

  if (token && role === "instructor") {
    navigate("/instructor/dashboard");
  }
}, []);


  return (
    <div className="flex h-screen">
      <div className="w-auto">
        <img src={login} alt="Signup illustration" className="h-full" />
      </div>

      <div className="items-center justify-center mx-auto w-1/2">
        <div className="flex space-x-3 justify-center items-center text-xg font-medium text-gray-700 py-5 ">
          <p>Don’t have account?</p>
          <button className="text-blue-500">Create Account</button>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="text-center mb-6">
              <img src={logo} alt="Logo" className="mx-auto h-24 " />
              <h2 className="text-3xl font-bold mt-7">Sign in to your account</h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
             <div className="relative w-full mt-4">
  <label className="absolute left-2  bg-white text-xs px-1 text-gray-700 z-10">
    Username
  </label>
  <input
    type="text"
    name="username"
    placeholder="Enter your username"
    value={formData.username}
    onChange={handleChange}
    className="w-full border border-black rounded px-3 py-2 mt-2 text-gray-800"
    required
  />
</div>


              <div className="relative w-full ">
      {/* Floating Label */}
      <label className="absolute left-2  bg-white text-xs px-1 text-gray-700 z-10">
        Password
      </label>

      {/* Input Box */}
      <input
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Enter password"
  value={formData.password}
  onChange={handleChange}
  className="w-full border border-black rounded px-3 py-2 mt-2 pr-10 text-gray-800"
/>

      {/* Toggle Icon */}
      <img
        src={showPassword ? eyeSlash : eye}
        alt="Toggle password visibility"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-5 w-5 h-5 cursor-pointer"
      />
    </div>

              <div className="flex justify-between">
                <div className="flex items-start text-sm gap-2 my-auto">
                  <input type="checkbox" className="mt-1" />
                  <p className="text-gray-500">Remember me</p>
                </div>
                <a href="/student/forgot-password" className="text-blue-500 text-sm">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white w-full font-medium p-3 rounded flex items-center h-10 justify-center"
              >
                Login
              </button>
            </form>

            <div className="my-6 text-center text-xs text-gray-400">SIGN UP WITH</div>

            <div className="flex gap-4 h-10">
              <div className="flex-1 border border-gray-100 rounded flex">
                <img src={google} alt="Google" className="h-10" />
                <span className="mx-auto my-auto">Google</span>
              </div>
              <div className="flex-1 border border-blue-200 rounded flex text-blue-400">
                <img src={fb} alt="Facebook" className="h-10 border-white" />
                <span className="mx-auto my-auto">Facebook</span>
              </div>
              <div className="flex-1 border border-gray-100 rounded flex">
                <img src={apple} alt="Apple" className="h-10" />
                <span className="mx-auto my-auto">Apple</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
