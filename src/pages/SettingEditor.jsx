
// export default SettingEditor;
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import "../styles/SettingEditor.css";

const SettingEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // 1. State disesuaikan dengan nama kolom di Tabel Setting yang baru
  const [formData, setFormData] = useState({
    slug_baru: "",
    share_judul: "",
    share_deskripsi: "",
    publikasi: true,
    // kunciSandi: false,
    // pin_sandi: "",
    putarMusik: true,
    tampilCerita: true,
    tampilKado: true,
    tampilStreaming: false, // Default false karena tidak semua pakai
    tampilBukuTamu: true,
  });

  const [fileGambar, setFileGambar] = useState(null);
  const [previewShare, setPreviewShare] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 2. Tarik Data dari RESTful API (GET)
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await axiosClient.get(`/invitation/${slug}`);
        if (response.data) {
          const data = response.data;
          // Mengambil data dari relasi tabel Setting (jika sudah ada)
          const setting = data.setting || {}; 

          setFormData({
            slug_baru: data.slug || "",
            share_judul: setting.share_judul || `The Wedding of ${data.mempelai?.pria_panggilan || 'Pria'} & ${data.mempelai?.wanita_panggilan || 'Wanita'}`,
            share_deskripsi: setting.share_deskripsi || "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
            publikasi: setting.publikasi !== false, // Jika undefined/null, anggap true
            // kunciSandi: setting.gunakan_pin === true,
            // pin_sandi: setting.pin_sandi || "",
            putarMusik: setting.putar_musik !== false,
            tampilCerita: setting.tampil_cerita !== false,
          });

          // Jika sudah ada gambar tersimpan di database
          if (setting.share_gambar) {
            // Sesuaikan URL ini jika kamu menggunakan folder public di backend
            // misal: `http://localhost:5000/uploads/${setting.share_gambar}`
            setPreviewShare(setting.share_gambar); 
          }
        }
      } catch (error) {
        console.error("Gagal menarik pengaturan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSetting();
  }, [slug]);

  // 3. Fungsi Handler (Ketikan & Sakelar)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'slug_baru') {
      const formattedSlug = value.toLowerCase().replace(/\s+/g, '-');
      setFormData({ ...formData, [name]: formattedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const ubahSakelar = (kunci) => {
    setFormData({ ...formData, [kunci]: !formData[kunci] });
  };

  // 4. Fungsi Upload Gambar (Pratinjau Medsos)
  const handleUploadGambar = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) return alert("Pilih file gambar!");
      setFileGambar(file);
      setPreviewShare(URL.createObjectURL(file));
    }
  };

  // 5. Fungsi Salin Link
  const handleSalinLink = () => {
    const link = `sakinah.id/${formData.slug_baru}`;
    navigator.clipboard.writeText(link);
    alert("Link berhasil disalin!");
  };

  // 6. Simpan Perubahan ke Database (RESTful API - PUT)
  const handleSimpan = async () => {
    setIsSaving(true);
    try {
      const dataKirim = new FormData();
      dataKirim.append('slug_baru', formData.slug_baru);
      dataKirim.append('share_judul', formData.share_judul);
      dataKirim.append('share_deskripsi', formData.share_deskripsi);
      dataKirim.append('publikasi', formData.publikasi);
      // dataKirim.append('gunakan_pin', formData.kunciSandi);
      // dataKirim.append('pin_sandi', formData.pin_sandi);
      dataKirim.append('putar_musik', formData.putarMusik);
      dataKirim.append('tampil_cerita', formData.tampilCerita);
      dataKirim.append('tampil_kado', formData.tampilKado);
      dataKirim.append('tampil_streaming', formData.tampilStreaming);
      dataKirim.append('tampil_bukutamu', formData.tampilBukuTamu);
      
      // Nama field 'share_gambar' ini harus sama dengan upload.single('share_gambar') di route backend
      if (fileGambar) {
        dataKirim.append('share_gambar', fileGambar);
      }

      await axiosClient.put(`/invitation/${slug}/setting`, dataKirim, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Pengaturan berhasil disimpan!");
      
      // Jika user merubah URL/Slug, pindahkan halaman ke URL yang baru
      if (formData.slug_baru !== slug) {
        navigate(`/editor/setting/${formData.slug_baru}`);
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center mt-20 text-purple-800 font-bold">Memuat Pengaturan...</div>;

  return (
    <div className="form-page-container">
      
      {/* HEADER */}
      <div className="form-top-bar">
        <h1 className="form-page-title">Pengaturan</h1>
        <Link to={`/kelola-undangan/${slug}`}>
          <button className="btn-back">← Kembali</button>
        </Link>
      </div>

      <div className="wadah-pengaturan">
        
        {/* KARTU 1: LINK UNDANGAN */}
        <div className="kartu-pengaturan">
          <h3 className="judul-seksi">Link Undangan</h3>
          <p className="deskripsi-seksi">Ubah link agar mudah diingat oleh tamu.</p>
          
          <label className="label-input">Slug / URL</label>
          <div className="flex gap-2 items-center mb-3">
            <span className="text-sm text-gray-400 font-bold">sakinah.id/</span>
            <input 
              type="text" 
              name="slug_baru"
              value={formData.slug_baru}
              onChange={handleChange}
              className="input-ungu mb-0 w-full" 
            />
          </div>

          <div className="kotak-info-link">
            <span className="teks-link">sakinah.id/{formData.slug_baru}</span>
            <button onClick={handleSalinLink} className="tombol-salin">Salin</button>
          </div>
        </div>

        {/* KARTU 2: TAMPILAN PRATINJAU LINK (MEDSOS) */}
        {/* <div className="kartu-pengaturan">
          <h3 className="judul-seksi">Pratinjau Link (Medsos)</h3>
          <p className="deskripsi-seksi">Muncul saat link dibagikan di WhatsApp, Telegram, dll.</p>
          
          <label className="pratinjau-wa block relative">
            <input type="file" accept="image/*" onChange={handleUploadGambar} className="hidden" />
            {previewShare ? (
              <img src={previewShare} alt="Preview Share" className="gambar-wa" />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                <span className="text-2xl mb-2">📸</span>
                <span className="text-xs">Klik untuk upload cover pratinjau</span>
              </div>
            )}
            <div className="label-upload-wa absolute bottom-4">Ganti Cover</div>
          </label>

          <div className="mt-4">
            <label className="label-input">Judul Share</label>
            <input 
              type="text" 
              name="share_judul"
              value={formData.share_judul || ""}
              onChange={handleChange}
              className="input-ungu" 
            />
            
            <label className="label-input">Deskripsi Singkat</label>
            <textarea 
              name="share_deskripsi"
              value={formData.share_deskripsi || ""}
              onChange={handleChange}
              className="input-ungu h-20 resize-none" 
            />
          </div>
        </div> */}

        {/* KARTU 3: KONTROL FITUR (SAKELAR) */}
        <div className="kartu-pengaturan">
          <h3 className="judul-seksi">Kontrol Fitur</h3>
          <p className="deskripsi-seksi">Aktifkan atau matikan fitur sesuai kebutuhan.</p>
          
          <div className="baris-pengaturan">
            <div>
              <p className="label-sakelar">Publikasikan Undangan</p>
              <p className="deskripsi-sakelar">Jika mati, undangan tidak bisa dibuka.</p>
            </div>
            <label className="wadah-sakelar">
              <input type="checkbox" className="input-sakelar" checked={formData.publikasi} onChange={() => ubahSakelar('publikasi')} />
              <span className="trek-sakelar"></span>
            </label>
          </div>

          <div className="baris-pengaturan">
            <div>
              <p className="label-sakelar">Autoplay Musik</p>
              <p className="deskripsi-sakelar">Musik langsung berputar saat dibuka.</p>
            </div>
            <label className="wadah-sakelar">
              <input type="checkbox" className="input-sakelar" checked={formData.putarMusik} onChange={() => ubahSakelar('putarMusik')} />
              <span className="trek-sakelar"></span>
            </label>
          </div>

           <div className="baris-pengaturan">
            <div>
              <p className="label-sakelar">Tampilkan Love Story</p>
              <p className="deskripsi-sakelar">Cerita perjalanan cinta kalian.</p>
            </div>
            <label className="wadah-sakelar">
              <input type="checkbox" className="input-sakelar" checked={formData.tampilCerita} onChange={() => ubahSakelar('tampilCerita')} />
              <span className="trek-sakelar"></span>
            </label>
          </div>

          {/* <div className="baris-pengaturan border-none">
            <div>
              <p className="label-sakelar">Gunakan Kunci Sandi (PIN)</p>
              <p className="deskripsi-sakelar">Tamu wajib memasukkan PIN.</p>
            </div>
            <label className="wadah-sakelar">
              <input type="checkbox" className="input-sakelar" checked={formData.kunciSandi} onChange={() => ubahSakelar('kunciSandi')} />
              <span className="trek-sakelar"></span>
            </label>
          </div> */}

          {/* Muncul jika PIN Aktif */}
          {/* {formData.kunciSandi && (
            <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-100 transition-all">
              <label className="label-input">Set PIN Keamanan</label>
              <input 
                type="text" 
                name="pin_sandi"
                value={formData.pin_sandi}
                onChange={handleChange}
                placeholder="Contoh: 123456" 
                className="input-ungu mb-0" 
              />
            </div>
          )} */}
          {/* SAKELAR 5: KADO DIGITAL */}
          <div className="baris-pengaturan">
            <div>
              <p className="label-sakelar">Tampilkan Kado Digital</p>
              <p className="deskripsi-sakelar">Menampilkan info rekening dan alamat kirim kado.</p>
            </div>
            <label className="wadah-sakelar">
              <input 
                 type="checkbox" 
                 className="input-sakelar" 
                 checked={formData.tampilKado} 
                 onChange={() => ubahSakelar('tampilKado')} 
              />
              <span className="trek-sakelar"></span>
            </label>
          </div>

          {/* SAKELAR 6: LIVE STREAMING */}
          <div className="baris-pengaturan">
            <div>
              <p className="label-sakelar">Tampilkan Live Streaming</p>
              <p className="deskripsi-sakelar">Menampilkan link siaran YouTube / Zoom acara.</p>
            </div>
            <label className="wadah-sakelar">
              <input 
                 type="checkbox" 
                 className="input-sakelar" 
                 checked={formData.tampilStreaming} 
                 onChange={() => ubahSakelar('tampilStreaming')} 
              />
              <span className="trek-sakelar"></span>
            </label>
          </div>

          {/* SAKELAR 7: BUKU TAMU & RSVP */}
          <div className="baris-pengaturan border-none">
            <div>
              <p className="label-sakelar">Tampilkan Buku Tamu & RSVP</p>
              <p className="deskripsi-sakelar">Mengizinkan tamu mengirim ucapan dan konfirmasi kehadiran.</p>
            </div>
            <label className="wadah-sakelar">
              <input 
                 type="checkbox" 
                 className="input-sakelar" 
                 checked={formData.tampilBukuTamu} 
                 onChange={() => ubahSakelar('tampilBukuTamu')} 
              />
              <span className="trek-sakelar"></span>
            </label>
          </div>

        </div>
        
      </div>
      

      {/* FOOTER TOMBOL SIMPAN */}
      <div className="floating-save-bar pb-6 mt-8 flex justify-center">
        <button 
          onClick={handleSimpan}
          disabled={isSaving}
          className="w-full max-w-2xl px-6 py-3 bg-[#581c4f] text-white font-bold rounded-xl shadow-md hover:bg-[#42103a] transition-all disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "💾 Simpan Pengaturan"}
        </button>
      </div>

    </div>
  );
};

export default SettingEditor;