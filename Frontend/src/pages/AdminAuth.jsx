import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminAuth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    AdminName: "",
    Adminemail: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.Adminemail) newErrors.Adminemail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.Adminemail))
      newErrors.Adminemail = "Email is invalid";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!isLogin && !form.AdminName)
      newErrors.AdminName = "Admin name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:6087/api/admin/admin-register",
        form
      );
      if (res.data.status) {
        toast.success(res.data.message);
        setForm({ AdminName: "", Adminemail: "", password: "" });
        setIsLogin(true); // switch to login after successful registration
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:6087/api/admin/admin-login",
        {
          Adminemail: form.Adminemail,
          password: form.password
        }
      );

      if (res.data.status) {
        toast.success(res.data.message);
        navigate("/create-company", { state: { adminEmail: form.Adminemail } });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="authContainer">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="authCard">
        <h1>Admin Portal</h1>

        <div className="toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        <div className="formInputs">
          {!isLogin && (
            <>
              <input
                type="text"
                name="AdminName"
                placeholder="Admin Name"
                value={form.AdminName}
                onChange={handleChange}
              />
              {errors.AdminName && (
                <span className="error">{errors.AdminName}</span>
              )}
            </>
          )}

          <input
            type="email"
            name="Adminemail"
            placeholder="Admin Email"
            value={form.Adminemail}
            onChange={handleChange}
          />
          {errors.Adminemail && <span className="error">{errors.Adminemail}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <button onClick={isLogin ? handleLogin : handleRegister}>
            {isLogin ? "Login" : "Register"}
          </button>
        </div>
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