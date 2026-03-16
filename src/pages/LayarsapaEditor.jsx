import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import axiosClient from '../api/axiosClient'; // Disiapkan untuk menyimpan data nanti
import "../styles/LayarsapaEditor.css";

const LayarsapaEditor = () => {
  const { slug } = useParams();

  // 1. State untuk data teks & preview gambar
  const [dataSapa, setDataSapa] = useState({
    judul: "The Wedding of ....",
    subjudul: "Selamat Datang, Tamu Undangan Terhormat",
    gambarLatar: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80" 
  });

  // 2. State khusus untuk menampung FILE asli (dikirim ke backend)
  const [fileGambar, setFileGambar] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDataSapa = async () => {
      try {
        const response = await axiosClient.get(`/invitation/${slug}/layar-sapa`);
        if (response.data) {
          // Timpa data default dengan data dari MySQL
          setDataSapa({
            judul: response.data.judul,
            subjudul: response.data.subjudul,
            gambarLatar: response.data.gambarLatar
          });
        }
      } catch (error) {
        console.error("Gagal menarik pengaturan Layar Sapa:", error);
      }
    };

    fetchDataSapa();
  }, [slug]);
  
  // Fungsi mengubah teks
  const ubahTeks = (e) => {
    const { name, value } = e.target;
    setDataSapa({ ...dataSapa, [name]: value });
  };

  // 3. Fungsi Menangani Upload Gambar Lokal
  const handleUploadGambar = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cek apakah file benar-benar gambar
      if (!file.type.startsWith("image/")) {
        alert("Mohon pilih file gambar (JPG/PNG)!");
        return;
      }

      // Simpan file asli ke state untuk di-upload ke database nanti
      setFileGambar(file); 

      // Buat URL sementara (Preview) agar gambar langsung berubah di layar monitor
      const previewUrl = URL.createObjectURL(file);
      setDataSapa({ ...dataSapa, gambarLatar: previewUrl });
    }
  };

  // 4. Fungsi Simpan Perubahan ke Database (Menunggu Backend Siap)
  const handleSimpan = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('judul', dataSapa.judul);
      formData.append('subjudul', dataSapa.subjudul);
      
      // Jika user memilih gambar baru, masukkan ke dalam kiriman
      if (fileGambar) {
        formData.append('gambarLatar', fileGambar);
      }

      // TODO: Tembak ke API Backend (Nanti kita buatkan di Node.js)
      await axiosClient.put(`/invitation/${slug}/layar-sapa`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Perubahan Layar Sapa berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-page-container">
      
      {/* HEADER */}
      <div className="form-top-bar">
        <h1 className="form-page-title">Layar Sapa</h1>
        <Link to={`/kelola-undangan/${slug}`}>
          <button className="btn-back">← Kembali</button>
        </Link>
      </div>

      <div className="wadah-pengaturan">
        
        {/* 1. AREA PRATINJAU */}
        <div className="wadah-pratinjau">
          <img src={dataSapa.gambarLatar} alt="Background" className="latar-layar" />
          
          <div className="konten-layar">
            <h2 className="judul-layar">{dataSapa.judul}</h2>
            <p className="subjudul-layar">{dataSapa.subjudul}</p>
            
            <div className="kotak-tamu-simulasi">
              <p className="text-sm text-white/70 mb-1 uppercase tracking-widest">Tamu Hadir</p>
              <p className="teks-tamu-simulasi">Bapak Joko..</p>
              <p className="text-xs text-white/60 mt-1">Keluarga</p>
            </div>
          </div>
        </div>

        {/* 2. PANEL PENGATURAN */}
        <div className="panel-pengaturan">
          <div className="kartu-pengaturan">
            <h3 className="judul-seksi">Teks Sambutan</h3>
            <p className="deskripsi-seksi">Sesuaikan kata-kata penyambutan di layar.</p>
            
            <label className="label-input">Judul Utama</label>
            <input type="text" name="judul" value={dataSapa.judul} onChange={ubahTeks} className="input-ungu" />

            <label className="label-input">Sub-Judul</label>
            <input type="text" name="subjudul" value={dataSapa.subjudul} onChange={ubahTeks} className="input-ungu" />
          </div>

          <div className="kartu-latar">
            <h3 className="judul-seksi">Latar Belakang</h3>
            <p className="deskripsi-seksi">Gunakan gambar resolusi tinggi (HD).</p>
            
            {/* 👇 PERUBAHAN UTAMA: Dibungkus dengan <label> agar kotak area-upload bisa diklik 👇 */}
            <label className="area-upload-latar relative cursor-pointer block overflow-hidden mt-2">
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleUploadGambar} 
                className="hidden" // Sembunyikan input aslinya
              />
              
              <div className="flex flex-col items-center justify-center h-full w-full absolute inset-0">
                <span className="ikon-upload">🖼️</span>
                <span className="teks-upload">Klik untuk Ganti Background</span>
                {fileGambar && <span className="text-[10px] text-green-600 mt-2 font-bold">✓ File terpilih: {fileGambar.name}</span>}
                {/* 👇 LOGIKA INDIKATOR MENGGUNAKAN TAG <p> 👇 */}
                {fileGambar ? (
                  <p className="text-[10px] text-green-600 mt-2 font-bold bg-green-50 px-2 py-1 rounded-md border border-green-200">
                    ✓ File baru: {fileGambar.name}
                  </p>
                ) : dataSapa.gambarLatar && !dataSapa.gambarLatar.includes("unsplash.com") ? (
                  <p className="text-[10px] text-[#581c4f] mt-2 font-bold bg-purple-50 px-2 py-1 rounded-md border border-purple-200">
                    ✓ Background siap
                  </p>
                ) : null}
              </div>
            </label>

          </div>
        </div>

      </div>

      {/* ========================================== */}
        {/* 3. AREA TOMBOL AKSI (HARMONIS & SIMETRIS)    */}
        {/* ========================================== */}
        <div className="mt-10 pt-6 border-t border-purple-100 w-full">
          
          {/* Grid membagi 2 ruang sama besar untuk tombol */}
          {/* GANTI JADI SEPERTI INI */}
<div className="flex flex-col md:flex-row items-center justify-center gap-6">
            
      {/* Kanan: Tombol Simpan (Warna Plum Tua) */}
            <button 
              onClick={handleSimpan} 
              disabled={isSaving} 
              className="px-6 py-3.5 bg-[#581c4f] text-white font-bold rounded-xl shadow-md hover:bg-[#42103a] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Menyimpan..." : "💾 Simpan Perubahan"}
            </button>
             {/* Kiri: Tombol Buka Layar (Warna Lilac / Lyla Lembut) */}
            <Link to={`/scanner/${slug}`} target="_blank" rel="noopener noreferrer" className="">
              <button className="w-full px-6 py-3.5 bg-[#f4e8f9] border border-[#d3b8e2] text-[#581c4f] font-bold rounded-xl shadow-sm hover:bg-[#eaddf4] transition-all flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                Buka Layar Sapa (Fullscreen)
              </button>
            </Link>

          </div>

          {/* Teks Bantuan dipusatkan di bawah agar layout tetap seimbang */}
          <p className="text-xs text-[#581c4f]/60 mt-4 text-center font-medium">
            *Buka Layar Sapa (Fullscreen) di tablet/laptop khusus untuk penerima tamu pada hari-H.
          </p>

        </div>

    </div>
  );
};

export default LayarsapaEditor;