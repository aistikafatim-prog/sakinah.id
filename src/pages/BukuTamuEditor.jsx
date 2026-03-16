import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const BukuTamuEditor = () => {
  const { slug } = useParams(); // Mengambil slug undangan dari URL browser

  // State untuk input form
  const [namaTamu, setNamaTamu] = useState('');

  // State untuk menyimpan daftar tamu (Sementara kita simpan di React, nanti bisa disambung ke Database)
  const [daftarTamu, setDaftarTamu] = useState([]);

  // State untuk loading
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menambah tamu ke dalam list
  // 2. MENAMBAHKAN TAMU KE DATABASE (POST)
  const handleTambahTamu = async (e) => {
    e.preventDefault();
    if (!namaTamu.trim()) {
      alert("Nama tamu tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    console.log("1. REACT: Tombol diklik, bersiap mengirim nama:", namaTamu); // RADAR 1

    try {
      // Pastikan baris ini ada (menembak API)
      const response = await axiosClient.post(`/invitation/${slug}/tamu`, {
        nama: namaTamu
      });

      console.log("2. REACT: Sukses! Balasan dari server:", response.data); // RADAR 2

      setDaftarTamu([...daftarTamu, response.data]);
      setNamaTamu('');
    } catch (error) {
      console.error("3. REACT: Gagal menembak API:", error); // RADAR 3
      alert("Terjadi kesalahan saat menyimpan tamu ke database.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menghapus tamu dari list
  // 3. MENGHAPUS TAMU DARI DATABASE (DELETE)
  const handleHapusTamu = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus tamu ini?");
    if (!konfirmasi) return;

    // RADAR 1: Cek apakah ID-nya benar-benar ada angkanya
    console.log("1. REACT: Meminta backend menghapus tamu dengan ID:", id);

    try {
      // Tembak API Delete ke Node.js
      const response = await axiosClient.delete(`/invitation/${slug}/tamu/${id}`);

      // RADAR 2: Jika berhasil, munculkan ini
      console.log("2. REACT: Sukses! Balasan dari server:", response.data);

      // HAPUS DARI LAYAR HANYA SETELAH NODE.JS BILANG SUKSES
      const filterData = daftarTamu.filter(tamu => tamu.id !== id);
      setDaftarTamu(filterData);

    } catch (error) {
      // RADAR 3: Jika Node.js menolak/gagal
      console.error("3. REACT: Gagal menghapus tamu:", error);
      alert("Gagal menghapus tamu. Silakan cek console F12.");
    }
  };

  // Fungsi untuk merangkai teks WA dan menyalin ke Clipboard
// --- FUNGSI COPY URL & PESAN YANG SUDAH DIENKRIPSI ---

  // Fungsi bantuan untuk membuat token Base64
  const generateGuestToken = (tamu) => {
    // Kita gabungkan ID dan Nama dengan pemisah garis vertikal (|)
    const dataMentah = `${tamu.id}|${tamu.nama}`; 
    // btoa() akan mengubah "24|Habib" menjadi "MjR8SGFiaWI="
    return btoa(dataMentah); 
  };

  const handleCopyLinkOnly = (tamu) => {
    const token = generateGuestToken(tamu);
    const baseUrl = window.location.origin; 
    const linkUndangan = `${baseUrl}/wedding/${slug}?guest=${token}`;
    
    navigator.clipboard.writeText(linkUndangan)
      .then(() => alert(`🔗 Link universal untuk ${tamu.nama} berhasil disalin!`))
      .catch(err => console.error('Gagal menyalin link: ', err));
  };

  const handleCopyPesan = (tamu) => {
    const token = generateGuestToken(tamu);
    const baseUrl = window.location.origin; 
    const linkUndangan = `${baseUrl}/wedding/${slug}?guest=${token}`;
    
    // Teks sudah disesuaikan agar universal untuk semua platform sosmed/chatting
    const pesanTeks = `Kepada Yth. Bapak/Ibu/Saudara/i,\n*${tamu.nama}*\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami.\n\nSilakan kunjungi tautan berikut untuk membuka undangan khusus Anda:\n${linkUndangan}\n\nAtas kehadiran & doa restu dari Anda, kami ucapkan terima kasih.\n===========================\nSakinah.id`;

    navigator.clipboard.writeText(pesanTeks)
      .then(() => alert(`✅ Teks untuk ${tamu.nama} berhasil disalin!`))
      .catch(err => console.error('Gagal menyalin teks: ', err));
  };
  // 1. MENGAMBIL DATA DARI DATABASE SAAT HALAMAN DIBUKA (GET)
  useEffect(() => {
    const fetchTamu = async () => {
      console.log("A. REACT: Mulai mengambil data tamu dari database...");
      try {
        const response = await axiosClient.get(`/invitation/${slug}/tamu`);

        console.log("B. REACT: Berhasil dapat data dari DB!", response.data);

        // Memasukkan data dari MySQL ke React
        setDaftarTamu(response.data);
      } catch (error) {
        console.error("C. REACT: Gagal mengambil daftar tamu:", error);
      }
    };
    fetchTamu();
  }, [slug]);
  return (
    <div className="form-page-container min-h-screen bg-[#FFF5F7] p-6 font-sans">

      {/* HEADER */}
      <div className="form-top-bar flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-[#581c4f]">Daftar Buku Tamu</h1>
        <Link to={`/kelola-undangan/${slug}`}>
          <button className="bg-[#581c4f] text-white px-4 py-2 rounded-lg hover:bg-[#6d2462] transition">
            ← Kembali
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* KOLOM KIRI: FORM TAMBAH TAMU */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-[#581c4f] mb-2">Tambah Tamu Baru</h3>
          <p className="text-sm text-gray-500 mb-4">Ketik nama tamu yang ingin diundang untuk membuat link khusus.</p>

          <form onSubmit={handleTambahTamu} className="flex flex-col gap-3">
            <input
              type="text"
              value={namaTamu}
              onChange={(e) => setNamaTamu(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-[#581c4f]"
            />
            <button
              type="submit"
              className="w-full bg-[#581c4f] text-white font-semibold py-2 rounded-lg hover:bg-[#6d2462] transition"
            >
              + Tambah ke Daftar
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR TAMU & TOMBOL COPY */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#581c4f] mb-4">
            Daftar Link Tamu ({daftarTamu.length})
          </h3>

          {daftarTamu.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-400">Belum ada tamu yang ditambahkan.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {daftarTamu.map((tamu) => (
                <div key={tamu.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition bg-gray-50">

                  {/* Info Nama */}
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{tamu.nama}</span>
                    <span className="text-xs text-gray-500">
                      ?to={encodeURIComponent(tamu.nama)}
                    </span>
                  </div>

                  {/* Tombol Aksi */}
                  {/* Tombol Aksi (Diperbarui) */}
                  <div className="flex flex-wrap gap-2">

                    {/* 1. Tombol Buka Web (Preview) */}
                    <a
                      href={`/wedding/${slug}?to=${encodeURIComponent(tamu.nama)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition flex items-center"
                      title="Lihat Undangan Tamu Ini"
                    >
                      🌐 Buka
                    </a>

                    {/* 2. Tombol Salin Link Saja */}
                    <button
                      onClick={() => handleCopyLinkOnly(tamu)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition flex items-center"
                      title="Salin Link Saja"
                    >
                      🔗 Link
                    </button>

                    {/* 3. Tombol Salin Pesan WA (Yang asli) */}
                    <button
                      onClick={() => handleCopyPesan(tamu)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition flex items-center"
                      title="Salin Pesan WA Lengkap"
                    >
                      📋 Salin Pesan
                    </button>

                    {/* 4. Tombol Hapus */}
                    <button
                      onClick={() => handleHapusTamu(tamu.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200 transition font-bold"
                      title="Hapus"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BukuTamuEditor;