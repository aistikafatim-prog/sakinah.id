// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css'; // <--- Panggil CSS yang tadi kita buat

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State: Apakah menu terbuka? (Default: Tutup/False)
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.removeItem('user_sakinah');
      navigate('/login');
    }
  };

  // Komponen Link Menu Kecil
  const MenuLink = ({ to, label, icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={() => setIsOpen(false)} // Kalau diklik, tutup menu (di HP)
        className={`menu-link ${isActive ? 'active' : ''}`} // Logika CSS Class sederhana
      >
        <span>{icon}</span>
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* 1. TOMBOL MENU HP (Hamburger) */}
      <button 
        className="tombol-menu-hp" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* 2. OVERLAY GELAP (Hanya muncul kalau isOpen = true) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* 3. SIDEBAR UTAMA */}
      {/* Kita tambahkan kelas 'open' jika state isOpen bernilai true */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        
        <div className="sidebar-header">
          <h1 className="logo-text">
            Sakinah<span style={{ color: '#fbcfe8' }}>.id</span>
          </h1>
        </div>

        <nav className="sidebar-nav">
          <MenuLink to="/dashboard" label="Dashboard" icon="🏠" />
          <MenuLink to="/undangan-saya" label="Undangan Saya" icon="💌" />
          <MenuLink to="/template" label="Katalog Template" icon="🎨" />
          <MenuLink to="/tagihan" label="Tagihan" icon="💳" />
          <MenuLink to="/akun" label="Akun Saya" icon="👤" />
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="tombol-keluar">
            <span>🚪</span> Keluar
          </button>
        </div>

      </div>
    </>
  );
}