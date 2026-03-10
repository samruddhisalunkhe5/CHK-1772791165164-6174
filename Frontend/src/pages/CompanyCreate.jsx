import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";


export default function CompanyCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    domain: "",
    adminEmail: "" // <-- include adminEmail here
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!location.state?.adminEmail) {
      toast.error("Admin email missing. Please login again.");
      navigate("/");
    } else {
      setAdminEmail(location.state.adminEmail);
      setForm(prev => ({ ...prev, adminEmail: location.state.adminEmail }));
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.companyName) newErrors.companyName = "Company name is required";
    if (!form.companyEmail) newErrors.companyEmail = "Company email is required";
    else if (!/\S+@\S+\.\S+/.test(form.companyEmail))
      newErrors.companyEmail = "Email is invalid";
    if (!form.adminEmail) newErrors.adminEmail = "Admin email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompany = async () => {
    if (!validate()) return;
    try {
      const res = await axios.post("http://localhost:6087/api/admin/add-company", form);
      if (res.data.status) {
        toast.success(res.data.message);
        setForm(prev => ({ ...prev, companyName: "", companyEmail: "", domain: "" }));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add company");
    }
  };

  return (
    <div className="authContainer">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="authCard">
        <h1>Create Company Account</h1>
        <div className="formInputs">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
          />
          {errors.companyName && <span className="error">{errors.companyName}</span>}

          <input
            type="email"
            name="companyEmail"
            placeholder="Company Email"
            value={form.companyEmail}
            onChange={handleChange}
          />
          {errors.companyEmail && <span className="error">{errors.companyEmail}</span>}

          <input
            type="text"
            name="domain"
            placeholder="Domain (optional)"
            value={form.domain}
            onChange={handleChange}
          />

          {/* Admin Email is hidden */}
          <input type="hidden" name="adminEmail" value={form.adminEmail} />

          <button onClick={handleAddCompany}>Add Company</button>
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