import React from "react";
import { useNavigate } from "react-router-dom";
export default function Role() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">Welcome to NodeBridge</h1>
      <p className="subtitle">Choose Your Role</p>

      <div className="roles">
          <div className="card" onClick={() => navigate("/admin")}>
          <h2>Admin</h2>
          <p>Manage system settings, users and permissions.</p>
          <button>Select</button>
        </div>

        <div className="card manager" onClick={() => navigate("/manager")}>
          <h2>Manager</h2>
          <p>Oversee projects and coordinate team members.</p>
          <button>Select</button>
        </div>

        <div className="card member">
          <h2>Member</h2>
          <p>Participate in tasks and collaborate with the team.</p>
          <button>Select</button>
        </div>
      </div>

      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family: Arial, sans-serif;
        }

        .container{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          background: linear-gradient(135deg,#1e3c72,#6a11cb);
          color:white;
        }

        .title{
          font-size:42px;
          margin-bottom:10px;
        }

        .subtitle{
          margin-bottom:40px;
          font-size:18px;
          opacity:0.9;
        }

        .roles{
          display:flex;
          gap:30px;
          flex-wrap:wrap;
          justify-content:center;
        }

        .card{
          width:260px;
          padding:25px;
          border-radius:15px;
          text-align:center;
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.2);
          transition:0.3s;
          box-shadow:0 10px 25px rgba(0,0,0,0.2);
        }

        .card:hover{
          transform: translateY(-8px) scale(1.03);
        }

        .card h2{
          margin-bottom:10px;
        }

        .card p{
          font-size:14px;
          margin-bottom:18px;
          opacity:0.9;
        }

        button{
          padding:10px 18px;
          border:none;
          border-radius:8px;
          background:linear-gradient(135deg,#4facfe,#b721ff);
          color:white;
          font-weight:bold;
          cursor:pointer;
        }

        button:hover{
          opacity:0.9;
        }
      `}</style>
    </div>
  );
}