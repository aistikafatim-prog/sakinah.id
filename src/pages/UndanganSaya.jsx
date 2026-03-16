import React, { useState, useEffect,} from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import axiosClient from '../api/axiosClient';
import '../styles/UndanganSaya.css';

export default function UndanganSaya() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInvitations = async () => {
    try {
      const res = await axiosClient.get('/undangan-saya');
      const invitationData = res.data.data || res.data;
      setInvitations(invitationData);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setLoading(false);
    }
  };
  // Fungsi untuk mengubah format tanggal bawaan database menjadi format Indonesia + Jam
  const formatTanggalWaktu = (tanggalString) => {
    if (!tanggalString) return "-";
    const date = new Date(tanggalString);

    // Menggunakan toLocaleString agar bisa memunculkan jam
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(/\./g, ':'); // Mengganti titik pemisah jam bawaan id-ID menjadi titik dua (:)
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleBuatBaru = () => {
    navigate('/template');
  };

  return (
    <div className="sakinah-layout">
      <Sidebar />

      <div className="sakinah-main-content">
        <TopBar />

        <main className="sakinah-scroll-area">
          <div className="sakinah-header-page">
            <h1 className="sakinah-title">Undangan Saya</h1>

            <div className="header-right-group">
              {invitations.length > 0 && !loading && (
                <button onClick={handleBuatBaru} className="btn-create-top">
                  + Buat Baru
                </button>
              )}
              <button onClick={() => navigate(-1)} className="btn-back">
                Kembali
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Sedang memuat data...</div>
          ) : (
            <>
              {invitations.length > 0 ? (
                // DESAIN BARU: LIST HORIZONTAL
                <div className="sakinah-list-container">
                  {invitations.map((item) => (
                    <div key={item.id} className="sakinah-list-item">

                      {/* Bagian Kiri: Ikon & Nama */}
                      <div className="list-item-left">
                        <div className="list-icon-box">
                          {/* Ikon Hati/Couple (Bisa kamu ganti dengan ikon dari library mu nanti) */}
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </div>
                        <div className="list-text-group">
                          {/* Menggunakan slug atau title undangan sebagai nama */}
                          <h3 className="list-title">{item.slug || item.title}</h3>
                          <p className="list-subtitle">Dibuat: {formatTanggalWaktu(item.createdAt || item.date)} </p>
                        </div>
                      </div>

                      {/* Bagian Kanan: Tombol Aksi */}
                      <div className="list-item-actions">
                        {/* Tombol Lihat Web (Buka di Tab Baru) */}
                        <a
                          href={`/wedding/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-lihat-web"
                        >
                          <span>🌐</span> Lihat Web
                        </a>

                        {/* Tombol Kelola (Tetap di tab yang sama, tapi tanpa loading reload) */}
                        <Link
                          to={`/kelola-undangan/${item.slug}`}
                          className="btn-kelola-list"
                        >
                          <span>⚙️</span> Kelola
                        </Link>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-container">
                  <div className="empty-state-card">
                    <div className="empty-icon">📂</div>
                    <h2 className="empty-title">Belum Ada Undangan</h2>
                    <p className="empty-desc">
                      Kamu belum memiliki undangan saat ini. Yuk, mulai rancang undangan pertamamu dengan template menarik dari Sakinah!
                    </p>
                    <button onClick={handleBuatBaru} className="btn-buat-sekarang">
                      + Buat Undangan Sekarang
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}