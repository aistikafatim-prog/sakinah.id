import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Pastikan path ini sesuai dengan foldermu
import "../styles/StreamingEditor.css";

const StreamingEditor = () => {
  const { slug } = useParams(); // Mengambil slug undangan dari URL
  
  // State data streaming
  const [stream, setStream] = useState({
    platform: 'youtube', // youtube, zoom, instagram
    url: '',
    judul: '',
  });

  const [isSaving, setIsSaving] = useState(false); // State untuk tombol loading

  // --- FITUR BARU: Mengambil data lama saat halaman dibuka ---
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await axiosClient.get(`/invitation/${slug}`);
        const existingData = response.data;
        
        // Karena kita pakai Opsi 2 (hanya 1 kolom di DB)
        if (existingData && existingData.acara) {
          setStream(prevStream => ({
            ...prevStream,
            url: existingData.acara.link_streaming || '' // Ambil link dari database
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil data lama:", error);
      }
    };
    fetchExistingData();
  }, [slug]);

  // Fungsi ganti input
  const ubahData = (e) => {
    setStream({ ...stream, [e.target.name]: e.target.value });
  };

  // Fungsi ganti platform
  const gantiPlatform = (idPlatform) => {
    setStream({ ...stream, platform: idPlatform, url: '' }); // Reset URL saat ganti platform
  };

  // --- FITUR BARU: Menyimpan data ke Backend ---
  const handleSimpan = async () => {
    if (!stream.url) {
        alert("Link streaming tidak boleh kosong!");
        return;
    }

    setIsSaving(true);
    try {
      // Mengirim HANYA link_streaming ke Backend (Sesuai Opsi 2)
      const response = await axiosClient.put(`/invitation/${slug}/streaming`, {
        link_streaming: stream.url
      });

      if (response.data) {
        alert("✅ Link Streaming berhasil disimpan!");
      }
    } catch (error) {
      console.error("Error saat menyimpan streaming:", error);
      alert("❌ Gagal menyimpan data. Pastikan server backend menyala.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-page-container">
      
      {/* HEADER */}
      <div className="form-top-bar">
        <h1 className="form-page-title">Live Streaming</h1>
        {/* Tombol kembali disesuaikan agar kembali ke dashboard undangan yang benar */}
        <Link to={`/kelola-undangan/${slug}`}>
          <button className="btn-back">← Kembali</button>
        </Link>
      </div>

      <div className="wadah-pengaturan">

        {/* 2. PENGATURAN LINK */}
        <div className="kartu-pengaturan">
          <h3 className="judul-seksi">Link Streaming</h3>

          {/* Pilihan Platform */}

          {/* Input URL & Judul */}
          <input 
            type="text" 
            name="url"
            value={stream.url}
            onChange={ubahData}
            placeholder={
              stream.platform === 'youtube' ? "Contoh: https://youtube.com/live/..." :
              stream.platform === 'zoom' ? "Contoh: https://zoom.us/j/..." : "Contoh: https://instagram.com/..."
            
            }
            className="input-ungu" 
          />
          {/* FOOTER SIMPAN */}
      <div className="floating-save-bar">
        <button 
          className="btn-save-data"
          onClick={handleSimpan}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Link"}
        </button>
      </div>
        </div>

      </div>

    </div>
  );
};

export default StreamingEditor;