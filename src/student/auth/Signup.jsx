import React, { useState } from "react";
import api from "../../api"; // 🔄 make sure the path is correct
import register from "../images/register.png";
import logo from "../../icons/logo.svg";
import eye from "../../icons/Eye.svg";
import google from "../../icons/google.svg";
import fb from "../../icons/fb.svg";
import apple from "../../icons/apple.svg";
import EyeSlash from "../../icons/EyeSlash.svg";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/api/student-register/", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert("Registration successful! Please log in.");
      window.location.href = "/student/login";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <>
      <div className="flex h-screen ">
        <div className="w-auto">
          <img src={register} alt="Signup illustration" className="h-full" />
        </div>

        <div className=" items-center justify-center mx-auto w-fit divide-y divide-gray-300">
          <div className="flex space-x-3 justify-center items-center font-medium text-gray-400 my-4 py-1 ">
            <p>Already have account?</p>
            <a href='/student/login'><button className="text-blue-500 cursor-pointer">Sign in</button></a>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full ">
              <div className="text-center mb-6">
                <img src={logo} alt="Logo" className="mx-auto h-20 " />
                <h2 className="text-3xl font-bold mt-2">Create your account</h2>
              </div>

              {/* ✅ FORM START */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First name..."
                      className="w-full h-10 border border-gray-200 px-3 rounded"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-1/2 flex items-end">
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last name..."
                      className="w-full h-10 border border-gray-200 px-3 rounded"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <label className="block text-sm text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username..."
                  className="w-full h-10 border border-gray-200 p-3 rounded"
                  onChange={handleChange}
                  required
                />

                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full h-10 border border-gray-200 p-3 rounded"
                  onChange={handleChange}
                  required
                />

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        className="w-full h-10 border border-gray-300 px-3 pr-10 rounded"
                        onChange={handleChange}
                        required
                      />
                      <img
                        src={showPassword ? EyeSlash : eye}
                        alt="Toggle visibility"
                        className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        className="w-full h-10 border border-gray-300 px-3 pr-10 rounded"
                        onChange={handleChange}
                        required
                      />
                      <img
                        src={showPassword ? EyeSlash : eye}
                        alt="Toggle visibility"
                        className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-start text-sm gap-2 my-auto">
                    <input type="checkbox" className="mt-1" required />
                    <p className="text-gray-500">
                      I Agree with all of your{" "}
                      <span className="text-blue-600 text cursor-pointer">
                        Terms & Conditions
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    className=" bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded flex items-center h-10 justify-center"
                  >
                    Create Account
                    <span className="ml-2">→</span>
                  </button>
                </div>
              </form>
              {/* ✅ FORM END */}

              <div className="my-6 text-center text-xs text-gray-400">
                SIGN UP WITH
              </div>

              <div className="flex gap-4 h-10">
                <div className="flex-1 border border-gray-100  rounded flex ">
                  <img src={google} alt="Google" className=" h-10" />
                  <span className="mx-auto my-auto">Google</span>
                </div>
                <div className="flex-1 border border-blue-200  rounded flex  text-blue-400 ">
                  <img src={fb} alt="Facebook" className=" h-10 border-white" />
                  <span className="mx-auto my-auto">Facebook</span>
                </div>
                <div className="flex-1 border border-gray-100  rounded flex ">
                  <img src={apple} alt="Apple" className=" h-10" />
                  <span className="mx-auto my-auto">Apple</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
