import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotImg from "../images/forgot.png"; // Replace with your image path
import logo from "../../icons/logo.svg";
import google from "../../icons/google.svg";
import fb from "../../icons/fb.svg";
import apple from "../../icons/apple.svg";
import chevron_back from "../../icons/chevron_back.svg";
import api from "../../api"; // Adjust the import path as necessary

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post("/api/forgot-password/", {
        email,
      });
  
      alert(response.data.message || "a reset link has been sent.");
      navigate("/student/login"); // Redirect to login page after successful submission
    } catch (error) {
      console.error("Error sending reset link:", error);
      alert(
        error.response?.data?.error ||
        "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left section */}
      <div className="w-1/2 flex flex-col justify-center my-auto">
        <img src={logo} alt="Logo" className="h-24 mb-6" />
        <div className="mx-auto ">
        <p
          className="  mb-6 cursor-pointer text-xs py-auto"
          onClick={() => navigate("/student/login")}
        >
          <img src={chevron_back} alt="Back" className="inline " />
          Back to login
        </p>

        <h2 className="text-3xl font-bold mb-4 ">Forgot your password?</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xl pr-2">
          Don’t worry, happens to all of us. Enter your email below to recover your <br></br> password
        </p>

        <form onSubmit={handleSubmit} className=" max-w-xl space-y-4">
        <div className="relative w-full">
  <label className="absolute  left-2 bg-white text-xs px-1 text-gray-700">
    Email
  </label>
  <input
  type="email"
  placeholder="@gmail.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border border-black rounded px-3 py-2 mt-2 text-gray-800"
/>

</div>


          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-3 mt-2 rounded"
          >
            Submit
          </button>
        </form>

        <div className="my-6 text-center text-xs text-gray-400">SIGN IN WITH</div>
        <div className="flex gap-4 w-full max-w-xl h-10">
          <button className="flex-1 flex items-center  border border-gray-300 rounded ">
            <img src={google} alt="Google" className="" />
            <span className="mx-auto" >Google</span>
          </button>
          <button className="flex-1 flex items-center border border-blue-300 rounded  text-blue-500">
            <img src={fb} alt="Facebook" className="" />
            <span className="mx-auto">Facebook</span>
          </button>
          <button className="flex-1 flex items-center  border border-gray-300 rounded ">
            <img src={apple} alt="Apple" className="" />
            <span className="mx-auto">Apple</span>
          </button>
        </div></div>
      </div>

      {/* Right image */}
    
        <img src={forgotImg} alt="Forgot illustration" className="h-screen w-1/2" />
      
    </div>
  );
};

export default ForgotPassword;
