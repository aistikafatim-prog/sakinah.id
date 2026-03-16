import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/InvitationPreview.css";

const InvitationPreview = () => {
  const [bukaUndangan, setBukaUndangan] = useState(false);

  const data = {
    pria: { nama: "Andika Pratama", panggil: "Andika", ortu: "Bpk. Budi & Ibu Siti" },
    wanita: { nama: "Arsinta Putri", panggil: "Arsinta", ortu: "Bpk. Joko & Ibu Iriana" },
    acara: {
      tanggal: "Minggu, 02 Februari 2026",
      jam: "08:00 WIB",
      lokasi: "Gedung Graha Saba, Solo",
    },
    musik: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  /* ================== COVER ================== */
  if (!bukaUndangan) {
    return (
      <div className="cover">
        <div className="cover-isi">
          <p className="cover-subjudul">The Wedding Of</p>
          <h1 className="cover-judul">
            {data.wanita.panggil} & {data.pria.panggil}
          </h1>

          <div className="cover-tamu">
            <p className="cover-tamu-label">Kepada Yth.</p>
            <h3 className="cover-tamu-nama">Tamu Spesial</h3>
          </div>

          <button className="btn-buka" onClick={() => setBukaUndangan(true)}>
            ✉️ Buka Undangan
          </button>
        </div>
      </div>
    );
  }

  /* ================== ISI ================== */
  return (
    <div className="halaman-undangan">
      <audio src={data.musik} autoPlay loop />

      {/* Hero */}
      <div className="hero">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
          alt="Couple"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Salam */}
      <div className="salam">
        <h2>Assalamu'alaikum</h2>
        <p>
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
          menyelenggarakan pernikahan putra-putri kami:
        </p>
      </div>

      {/* Mempelai */}
      <div className="mempelai">
        <div className="profil">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" alt="Wanita" />
          <h3>{data.wanita.nama}</h3>
          <p>Putri dari {data.wanita.ortu}</p>
        </div>

        <div className="profil">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" alt="Pria" />
          <h3>{data.pria.nama}</h3>
          <p>Putra dari {data.pria.ortu}</p>
        </div>
      </div>

      {/* Acara */}
      <div className="acara">
        <h3>Akad & Resepsi</h3>
        <p>🗓 {data.acara.tanggal}</p>
        <p>⏰ {data.acara.jam}</p>
        <p>📍 {data.acara.lokasi}</p>

        <button className="btn-peta">Lihat Peta Lokasi</button>
      </div>

      {/* Menu Bawah */}
      <div className="menu-bawah">
        <button>🏠<span>Home</span></button>
        <button>💌<span>Ucapan</span></button>
        <Link to="/kelola-undangan">
          <button>⚙️<span>Edit</span></button>
        </Link>
      </div>
    </div>
  );
};

export default InvitationPreview;
