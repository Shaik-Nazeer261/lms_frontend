import  { useEffect, useState } from 'react';
import upload from '../../icons/upload.svg';
import api from '../../api.jsx';


const ProfileSettings = () => {
  const [profile, setProfile] = useState({
  user: {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  },
  headline: '',
  biography: '',
  website: '',
  social_links: {},
  language: '',
  profile_picture: ''
});
const [imageFile, setImageFile] = useState(null);



  useEffect(() => {
    api.get('/api/student/profile/')
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch profile', err);
      });
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (['first_name', 'last_name', 'username', 'email'].includes(name)) {
    setProfile((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
    }));
  } else {
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


 const handleSubmit = (e) => {
  e.preventDefault();

  // Destructure values from profile
  const { user, headline } = profile;
  const { first_name, last_name, username, email } = user;

  // Prepare FormData
  const formData = new FormData();
  formData.append('first_name', first_name);
  formData.append('last_name', last_name);
  formData.append('username', username);
  formData.append('email', email);
  formData.append('headline', headline || '');

  if (imageFile) {
    formData.append('profile_picture', imageFile);
  }

  // Make PUT request
  api
    .put('/api/student/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log('Profile updated', res.data);
      alert('Profile updated successfully!');
    })
    .catch((err) => {
      console.error('Error updating profile', err);
      alert('Update failed!');
    });
};
console.log(`${import.meta.env.VITE_BACKEND_URL}${profile.profile_picture}`)

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-[#00113D] mb-8">Account settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Photo Upload */}
        <div className="text-center p-4">
         <div className="relative w-64 h-64 mx-auto rounded overflow-hidden">
 <img
  src={
    imageFile
      ? URL.createObjectURL(imageFile)
      : profile.profile_picture
        ? `${import.meta.env.VITE_BACKEND_URL}${profile.profile_picture}`
        : 'https://via.placeholder.com/150'
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

        {/* Input Fields */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-[#00113D] block mb-1">Full name</label>
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={profile.user.first_name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium text-transparent block mb-1">Full name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={profile.user.last_name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#00113D] block mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={profile.user.username}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#00113D] block mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={profile.user.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#00113D] block mb-1">Title</label>
            <div className="relative">
              <input
  type="text"
  name="headline"
  value={profile.headline || ''}
  onChange={handleChange}
  placeholder="Your title, profession or small biography"
  className="w-full border border-gray-300 px-3 py-2 rounded"
  maxLength={50}
/>
<span className="absolute bottom-2 right-3 text-xs text-gray-500">
  {(profile.headline || '').length}/50
</span>

            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileSettings;
