import React, { useState } from "react";
import logo from "../../icons/logo.svg";
import eye from "../../icons/eye.svg";
import eyeSlash from "../../icons/EyeSlash.svg";
import google from "../../icons/google.svg";
import fb from "../../icons/fb.svg";
import apple from "../../icons/apple.svg";
import forgot from "../images/forgot.png"; // Replace with your image path
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { uid, token } = useParams();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await api.post(`/api/reset-password/${uid}/${token}/`, {
        new_password: password,
      });
      alert(response.data.message || "Password reset successful!");
      navigate("/student/login");
    } catch (error) {
      console.error("Reset error:", error);
      alert(error.response?.data?.error || "Something went wrong.");
    }
  };
  


  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 p-24 ">
        <img src={logo} alt="Logo" className="mx-auto h-24" />
        <div className=" my-8 px-10">
          <h2 className="text-4xl font-bold mt-2">Set a password</h2>
          <p className="text-sm text-gray-500 max-w-xl mt-4">
            Your previous password has been reseted. Please set a new password
            for your account.
          </p>
        </div>

        <div className="px-10">
          {" "}
          <form className="w-full max-w-xl space-y-4" onSubmit={handleSubmit}>
            {/* Create Password */}
            <div className="relative w-full">
              <label className="absolute -top-1 left-2 bg-white text-xs px-1 text-gray-600">
                Create Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder=""
                className="w-full border border-black rounded  py-2 mt-1 pl-3 text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <img
                src={passwordVisible ? eyeSlash : eye}
                alt="Toggle visibility"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3.5 h-5 w-5 cursor-pointer"
              />
            </div>

            {/* Re-enter Password */}
            <div className="relative w-full">
              <label className="absolute -top-1 left-2 bg-white text-xs px-1 text-gray-600">
                Re-enter Password
              </label>
              <input
                type={confirmVisible ? "text" : "password"}
                placeholder=""
                className="w-full border border-black rounded  py-2 mt-1 pl-3 text-gray-800"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <img
                src={confirmVisible ? eyeSlash : eye}
                alt="Toggle visibility"
                onClick={() => setConfirmVisible(!confirmVisible)}
                className="absolute right-3 top-3.5 h-5 w-5 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 mt-2 h-10 rounded"
            >
              Set password
            </button>
          </form>
          {/* Social Auth */}
          <div className="mt-7 w-full max-w-xl">
            <p className="text-center text-xs text-gray-400 mb-4">
              SIGN IN WITH
            </p>
            <div className="flex gap-4 w-full max-w-xl mt-1 h-10">
              <button className="flex-1 flex items-center  border border-gray-300 rounded ">
                <img src={google} alt="Google" className="h-9" />
                <span className="mx-auto">Google</span>
              </button>
              <button className="flex-1 flex items-center border border-blue-300 rounded  text-blue-500">
                <img src={fb} alt="Facebook" className="h-9" />
                <span className="mx-auto">Facebook</span>
              </button>
              <button className="flex-1 flex items-center  border border-gray-300 rounded ">
                <img src={apple} alt="Apple" className="h-9" />
                <span className="mx-auto">Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}

      <img
        src={forgot}
        alt="Password Reset Illustration"
        className="h-full w-1/2 object-cover"
      />
    </div>
  );
};

export default SetPassword;
