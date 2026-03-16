import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Pastikan path axiosClient benar
import '../styles/ManageInvitation.css';

const ManageInvitation = () => {
  const { slug } = useParams();
  const [invitationData, setInvitationData] = useState(null);
  const [loading, setLoading] = useState(true);

const [statistik, setStatistik] = useState({
    totalTamu: 0,
    tamuHadir: 0,
    totalUcapan: 0
  });

  // --- ICON COMPONENTS ---
  const IconBill = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 12V14H16V12H8ZM8 16V18H13V16H8Z" fill="currentColor"/>
      <path d="M16 12H8V14H16V12Z" fill="currentColor"/>
      <path d="M13 16H8V18H13V16Z" fill="currentColor"/>
    </svg>
  );

  const IconEnvelope = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 6L12 11L4 6H20ZM4 18V8L12 13L20 8V18H4Z" fill="currentColor"/>
      <path d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z" fill="currentColor"/> 
      <path d="M12 15.5C14 14 15 13 15 12C15 11 14 10.5 13.5 10.5C13 10.5 12.5 11 12 11.5C11.5 11 11 10.5 10.5 10.5C10 10.5 9 11 9 12C9 13 10 14 12 15.5Z" fill="currentColor"/>
    </svg>
  );

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // Route ini harus sesuai dengan route di backend (lihat dashboardRoutes.js atau invitationRoutes.js)
        // Biasanya: router.get('/invitation/:slug', ...)
        const res = await axiosClient.get(`/invitation/${slug}`);
        setInvitationData(res.data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);


  // 👇 2.  USEEFFECT PENARIK STATISTIK 
  useEffect(() => {
    const fetchStatistik = async () => {
      if (!slug) return;
      try {
        const response = await axiosClient.get(`/invitation/${slug}/stats`);
        if (response.data) {
          setStatistik(response.data);
        }
      } catch (error) {
        console.error("Gagal menarik data statistik:", error);
      }
    };

    fetchStatistik();
  }, [slug]);

  // --- MENU ITEMS (Dinamis dengan Slug) ---
  // Pastikan route-route ini (/editor/form/:slug) sudah didaftarkan di App.jsx nanti
  const menuItems = [
    { id: 1, label: "Form Undangan", icon: <IconBill />, link: `/editor/form/${slug}` },
    { id: 2, label: "Buku Tamu", icon: <IconEnvelope />, link: `/editor/bukutamu/${slug}` },
    { id: 3, label: "RSVP & Ucapan", icon: <IconBill />, link: `/editor/rsvp/${slug}` },
    { id: 4, label: "Setting", icon: <IconEnvelope />, link: `/editor/setting/${slug}` },
    { id: 5, label: "Layar Sapa", icon: <IconBill />, link: `/editor/layar-sapa/${slug}` },
    { id: 6, label: "Streaming", icon: <IconEnvelope />, link: `/editor/streaming/${slug}` },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-900">Memuat data...</div>;

  // Nama Default jika data mempelai belum diisi
  const displayName = (invitationData && invitationData.mempelai && invitationData.mempelai.pria_panggilan) 
    ? `${invitationData.mempelai.pria_panggilan} & ${invitationData.mempelai.wanita_panggilan}`
    : "Undangan Baru (Draft)";

  return (
    <div className="manage-page">
      
      {/* HEADER CARD */}
      <div className="manage-header">
        <h1 className="text-2xl md:text-3xl font-bold text-white font-serif mb-1 capitalize">
          {displayName}
        </h1>
        <p className="text-white/80 text-sm mb-6 flex items-center gap-2 justify-center">
          <span>sakinah.id/wedding/{slug}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(`http://localhost:5173/wedding/${slug}`)}
            className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-xs transition"
          >
            Copy
          </button>
        </p>

        {/* Statistik Header (Bisa dibuat dinamis nanti) */}
        <div className="header-stat-card">
          <div className="header-stat-item">
            <span className="header-stat-value">{statistik.totalTamu || 0}</span>
            <span className="header-stat-label">Tamu</span>
          </div>
          <div className="header-stat-item">
            <span className="header-stat-value">{statistik.tamuHadir || 0}</span>
            <span className="header-stat-label">Akan Hadir</span>
          </div>
          <div className="header-stat-item">
            <span className="header-stat-value">{statistik.totalUcapan || 0}</span>
            <span className="header-stat-label">Ucapan</span>
          </div>
        </div>
      </div>

      {/* GRID MENU */}
      <div className="grid-menu-container">
        {menuItems.map((item) => (
          <Link to={item.link} key={item.id} className="block h-full">
            <div className="grid-menu-item h-full flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-purple-50">
              <div className="text-[#581c4f] mb-3">
                {item.icon}
              </div>
              <span className="grid-menu-label font-medium text-gray-700">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* TOMBOL HOME (Balik ke Dashboard) */}
      <div className="fixed bottom-6 right-6">
        <Link to="/undangan-saya"> {/* Arahkan ke list undangan saya */}
          <div className="fab-home bg-[#581c4f] text-white p-4 rounded-full shadow-lg hover:bg-[#45163e] transition">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
             </svg>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default ManageInvitation;