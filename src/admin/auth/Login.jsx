import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.jsx';
const AdminLogin = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await api.post('/api/login/', {
        username: usernameOrEmail,
        password: password,
      });

      const { access, refresh, user } = response.data;

      if (user.role !== 'admin') {
        setErrorMsg('Only admin users can log in.');
        return;
      }

      // Store tokens and user info
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      setErrorMsg(
        error.response?.data?.detail || 'Login failed. Check credentials.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username or Email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter username or email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
