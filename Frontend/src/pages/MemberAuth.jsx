import { useState } from 'react';
import axios from 'axios';

export default function MemberAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobileNo: '',
    projectId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await axios.post('/api/member-login', {
          email: formData.email,
          password: formData.password,
          projectId: formData.projectId
        });
        setSuccess(res.data.message);
      } else {
        const res = await axios.post('/api/member-signup', formData);
        setSuccess(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

        <div className="toggle">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="formInputs" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="mobileNo"
                placeholder="Mobile Number"
                value={formData.mobileNo}
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="projectId"
            placeholder="Project ID"
            value={formData.projectId}
            onChange={handleChange}
            required
          />

          {error && <div className="error">{error}</div>}
          {success && <div style={{ color: '#4efc8d', marginBottom: '10px' }}>{success}</div>}

          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
      </div>

      <style>{`
        .authContainer {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e3c72, #6a11cb);
          font-family: Arial, sans-serif;
        }
        .authCard {
          background: rgba(255,255,255,0.05);
          padding: 40px 30px;
          border-radius: 20px;
          backdrop-filter: blur(15px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          width: 360px;
        }
        .authCard h1 {
          text-align: center;
          color: white;
          margin-bottom: 25px;
        }
        .toggle {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 25px;
        }
        .toggle button {
          padding: 10px 25px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          background: linear-gradient(135deg, #4facfe, #b721ff);
          color: white;
          transition: 0.3s;
        }
        .toggle button.active {
          box-shadow: 0 0 15px rgba(255,255,255,0.4);
        }
        .toggle button:hover {
          transform: scale(1.05);
        }
        .formInputs {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .formInputs input {
          width: 100%;
          padding: 12px 15px;
          margin: 8px 0;
          border-radius: 10px;
          border: none;
          outline: none;
          font-size: 16px;
          background: rgba(255,255,255,0.1);
          color: white;
          backdrop-filter: blur(10px);
        }
        .formInputs input::placeholder {
          color: rgba(255,255,255,0.7);
        }
        .formInputs button {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          border-radius: 10px;
          border: none;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          background: linear-gradient(135deg, #4facfe, #b721ff);
          color: white;
          transition: 0.3s;
        }
        .formInputs button:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
        .error {
          color: #ff6b6b;
          font-size: 14px;
          margin-bottom: 5px;
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
}