import React, { useEffect, useState } from "react";
import upload from "../../icons/upload.svg";
import api from "../../api";

const AccountSettings = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
    headline: "",
    biography: "",
    profile_picture: "",
    personal_website: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    twitter_url: "",
    whatsapp_number: "",
    youtube_url: "",
    password: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    api
      .get("/api/profile/")
      .then((res) => {
        const data = res.data;
        setForm((prev) => ({
          ...prev,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          username: data.user.username,
          phone_number: data.phone_number || "",
          headline: data.headline || "",
          biography: data.biography || "",
          profile_picture: data.profile_picture,
          personal_website: data.personal_website || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
          whatsapp_number: data.whatsapp_number || "",
          youtube_url: data.youtube_url || "",
        }));
      })
      .catch((err) => console.error("Failed to load profile data", err));
  }, []);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
      // Skip profile_picture string if it's unchanged
      if (key !== "profile_picture" && typeof value !== "object") {
        formData.append(key, value);
      }
    });

    // Only append if imageFile is a new File object
    if (imageFile instanceof File) {
      formData.append("profile_picture", imageFile);
    }

      await api.put("/api/profile/", formData);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Account Settings */}
      <div className="bg-white p-6 rounded shadow">
        {/* Heading */}
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

        {/* Grid layout for top section with image and essential fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Form Fields */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <span className="col-span-2">Full name</span>
            <input
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="First name"
              className="border p-2 rounded"
            />
            <input
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="Last name"
              className="border p-2 rounded"
            />

            <span className="col-span-2">Username</span>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your username"
              className="border p-2  rounded"
            />
            <span className="col-span-2">Phone Number</span>
            <div className="flex gap-2">
              <select className="border p-2 rounded w-24">
                <option value="+91">+91</option>
              </select>
              <input
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                placeholder="Your Phone number..."
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          {/* Right Side: Profile Picture Upload */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto rounded overflow-hidden">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : form.profile_picture
                      ? `${import.meta.env.VITE_BACKEND_URL}${
                          form.profile_picture
                        }`
                      : "https://via.placeholder.com/150"
                  }
                  alt="User"
                  className="w-full h-full object-cover"
                />
                <label className="absolute bottom-0 w-full bg-black/40 text-white py-2 text-sm flex justify-center items-center cursor-pointer">
                  <img src={upload} className="mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 w-56 mx-auto">
                Image size should be under 1MB and image ratio needs to be 1:1
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Fields: Full Width */}
        <div className="mt-6 grid grid-cols-1 gap-4">
          <span>Title</span>
          <input
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            placeholder="Your title, profession or small biography"
            className="border p-2 rounded"
          />

          <span>Biography</span>
          <textarea
            value={form.biography}
            onChange={(e) => setForm({ ...form, biography: e.target.value })}
            placeholder="Your biography..."
            className="border p-2 rounded h-24"
          />

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Social Profile */}
      <div className="bg-white p-6 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">Social Profile</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      placeholder="https://yourportfolio.com"
      className="border p-2 rounded col-span-2"
      value={form.personal_website}
      onChange={(e) => setForm({ ...form, personal_website: e.target.value })}
    />
    <input
      placeholder="https://facebook.com/yourprofile"
      className="border p-2 rounded"
      value={form.facebook_url}
      onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
    />
    <input
      placeholder="https://instagram.com/yourprofile"
      className="border p-2 rounded"
      value={form.instagram_url}
      onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
    />
    <input
      placeholder="https://twitter.com/yourhandle"
      className="border p-2 rounded"
      value={form.twitter_url}
      onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
    />
    <input
      placeholder="https://linkedin.com/in/yourprofile"
      className="border p-2 rounded"
      value={form.linkedin_url}
      onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
    />
    <input
      placeholder="e.g. +919876543210"
      className="border p-2 rounded"
      value={form.whatsapp_number}
      onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
    />
    <input
      placeholder="https://youtube.com/@yourchannel"
      className="border p-2 rounded"
      value={form.youtube_url}
      onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
    />
    <button
      onClick={handleSave}
      className="w-fit bg-blue-500 text-white px-4 py-2 rounded"
    >
      Save Changes
    </button>
  </div>
</div>

      <div className="flex">
        {/* Notifications */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-2">
            {[
              "I want to know who write a review on my course.",
              "I want to know who commented on my lecture.",
              "I want to know who download my lecture notes.",
              "I want to know who replied on my comment.",
              "I want to know daily how many people visited my profile.",
              "I want to know who download my lecture attach file.",
            ].map((text, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-blue-600"
                />
                <span>{text}</span>
              </label>
            ))}
            <button  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Change password</h2>
          <div className="space-y-4">
            <input
              placeholder="Current Password"
              type="password"
              className="border p-2 rounded w-full"
            />
            <input
              placeholder="New Password"
              type="password"
              className="border p-2 rounded w-full"
            />
            <input
              placeholder="Confirm new password"
              type="password"
              className="border p-2 rounded w-full"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
