import React from 'react';
import '../../styles/HeroSection.css'; 

const HeroSection = ({ data }) => {
  
  // Helper: Fungsi buat bikin URL gambar
  const imgUrl = (filename) => filename 
    ? `http://localhost:5000/uploads/${filename}` 
    : "foto prewedding"; 

  // Helper: Format Tanggal biar cantik
  const formatDate = (dateString) => {
    if (!dateString) return "Save The Date";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // --- FITUR BARU: GENERATOR LINK GOOGLE CALENDAR ---
  const getGoogleCalendarLink = () => {
    const pria = data.mempelai?.pria_panggilan || "Groom";
    const wanita = data.mempelai?.wanita_panggilan || "Bride";
    const lokasi = data.acara?.resepsi_lokasi || "Lokasi Acara";
    
    // Rangkai teks judul dan deskripsi acara di kalender
    const title = `The Wedding of ${wanita} & ${pria}`;
    const details = `Undangan Pernikahan: ${wanita} & ${pria}\n\nLokasi: ${lokasi}\n\nTanggal: ${formatDate(data.acara?.resepsi_tanggal)}`;
    
    // Coba format tanggal jika ada (Mengubah "2026-06-26" menjadi "20260626")
    let datesParam = "";
    if (data.acara?.resepsi_tanggal) {
        const cleanDate = data.acara.resepsi_tanggal.replace(/-/g, '');
        datesParam = `&dates=${cleanDate}/${cleanDate}`; 
    }

    // Gabungkan semuanya menjadi URL rahasia Google Calendar
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(lokasi)}${datesParam}`;
  };

  // Safety Check: Kalau data belum siap, jangan render aneh-aneh
  if (!data) return null;

  return (
    <section className="hero-wrapper">
      <div className="hero-card">
        
        {/* Bagian Gambar (Dinamis) */}
        <div className="hero-image-frame">
          <img 
            src={imgUrl(data.cover_foto)} 
            alt="Cover"
            onError={(e) => { e.target.src = "foto prewedding"; }}
          />
        </div>

        {/* Bagian Teks (Dinamis) */}
        <div className="text-center w-full flex flex-col items-center">
          <h2 className="hero-subtitle">The Wedding Of</h2>
          
          <div className="flex flex-col items-center">
            <h1 className="hero-name">
              {data.mempelai?.wanita_panggilan || "Bride"}
            </h1>
            
            <span className="hero-separator">&</span>
            
            <h1 className="hero-name">
              {data.mempelai?.pria_panggilan || "Groom"}
            </h1>
          </div>

          {/* Tanggal Resepsi (Dinamis) */}
          <p className="hero-date">
             {formatDate(data.acara?.resepsi_tanggal)}
          </p>

          {/* TOMBOL SAVE THE DATE (Sudah Diperbarui) */}
          {/* Menggunakan tag <a> agar berfungsi sebagai link eksternal */}
          <a 
            href={getGoogleCalendarLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hero-btn"
            style={{ display: 'inline-block', textDecoration: 'none' }}
          >
            📅 Save The Date
          </a>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;