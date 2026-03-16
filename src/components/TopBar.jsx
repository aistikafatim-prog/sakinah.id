import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopBar.css';

export default function TopBar({ user }) {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifikasi = [
    { id: 1, text: "Pesanan Undangan 'Ariska' berhasil dibuat!", waktu: "Baru saja" },
    { id: 2, text: "Selamat datang di Sakinah.id", waktu: "1 jam lalu" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user_sakinah');
    localStorage.removeItem('token_sakinah');
    navigate('/login');
  };

  return (
    <div className="topbar-container">
      
      <div className="hidden md:block"></div>

      <div className="topbar-right">
        
        {/* === 1. LONCENG === */}
        <div className="relative">
          <button 
            onClick={() => {
                setShowNotif(!showNotif);
                setShowProfile(false);
            }}
            className="btn-notif"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="notif-badge"></span>
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h4 className="notif-title">Notifikasi</h4>
              </div>
              <div className="notif-list">
                {notifikasi.map((item) => (
                  <div key={item.id} className="notif-item">
                    <p className="notif-text">{item.text}</p>
                    <p className="notif-time">{item.waktu}</p>
                  </div>
                ))}
              </div>
              <div className="notif-footer">
                <button className="btn-read-all">Tandai semua dibaca</button>
              </div>
            </div>
          )}
        </div>

        {/* === 2. PROFIL USER (IKON ORANG KEMBALI) === */}
        <div className="relative">
            <button 
                onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotif(false);
                }} 
                className="btn-profile"
            >
            <div className="profile-avatar">
                {/* --- KEMBALI KE IKON SVG --- */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            
            <div className="profile-info">
                <p className="profile-label">Halo,</p>
                <p className="profile-name">
                {user?.name || user?.email?.split('@')[0] || 'User'}
                </p>
            </div>
            
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-white/70 transition-transform ${showProfile ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfile && (
                <div className="profile-dropdown-menu">
                    <div className="block lg:hidden px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">Login sebagai:</p>
                        <p className="text-sm font-bold text-gray-700">{user?.name || 'User'}</p>
                    </div>

                    <button onClick={() => navigate('/akun')} className="profile-menu-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profil Saya
                    </button>
                    
                    <button onClick={() => navigate('/pengaturan')} className="profile-menu-item">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Pengaturan
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button onClick={handleLogout} className="profile-menu-item text-red-600 hover:bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}