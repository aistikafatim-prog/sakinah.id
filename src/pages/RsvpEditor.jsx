import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Pastikan path ini sesuai
import "../styles/RsvpEditor.css";

const RsvpEditor = () => {
  const { slug } = useParams(); // Mengambil slug dari URL
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState(''); // State untuk kolom pencarian
  const [messages, setMessages] = useState([]); // State untuk data dari MySQL
  const [isLoading, setIsLoading] = useState(true);

  // 1. MENGAMBIL DATA DARI BACKEND (GET)
  useEffect(() => {
    const fetchUcapan = async () => {
      try {
        const response = await axiosClient.get(`/invitation/${slug}/ucapan`);
        setMessages(response.data);
      } catch (error) {
        console.error("Gagal mengambil data ucapan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUcapan();
  }, [slug]);

  // 2. MENGHAPUS UCAPAN DARI DATABASE (DELETE)
  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus ucapan ini?");
    if (!konfirmasi) return;

    try {
      await axiosClient.delete(`/invitation/${slug}/ucapan/${id}`);
      // Jika sukses di DB, hapus juga dari layar
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error("Gagal menghapus ucapan:", error);
      alert("Gagal menghapus ucapan.");
    }
  };

  // 3. FUNGSI PERCANTIK TANGGAL DARI MYSQL
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

// 4. MENGHITUNG STATISTIK OTOMATIS
  
  // Total Ucapan tetap menggunakan .length karena ini menghitung jumlah pesan/form yang masuk
  const totalUcapan = messages.length; 

  // Hitung total orang yang HADIR dengan menjumlahkan isi kolom 'jumlah_tamu'
  const hadirCount = messages
    .filter(m => m.konfirmasi_hadir === 'Hadir')
    .reduce((total, msg) => {
      // Kita ubah ke Number() agar tidak dibaca sebagai teks (string).
      // Tambahkan || 1 sebagai cadangan jika kolom jumlah_tamu ternyata kosong.
      return total + (Number(msg.jumlah_tamu) || 1);
    }, 0);

  // Hitung total orang yang TIDAK HADIR (opsional, bisa dijumlahkan juga atau tetap .length)
  const tidakHadirCount = messages
    .filter(m => m.konfirmasi_hadir === 'Tidak Hadir')
    .reduce((total, msg) => total + (Number(msg.jumlah_tamu) || 1), 0);

  // 5. LOGIKA FILTER TAB & PENCARIAN NAMA
  const filteredMessages = messages.filter(msg => {
    // Sesuaikan status dengan ENUM: 'Hadir', 'Tidak Hadir', 'Masih Ragu'
    const matchFilter = filter === 'Semua' || 
                        (filter === 'Tidak' ? msg.konfirmasi_hadir === 'Tidak Hadir' : msg.konfirmasi_hadir === filter);
    
    // Gunakan msg.nama_pengirim
    const matchSearch = msg.nama_pengirim && msg.nama_pengirim.toLowerCase().includes(searchQuery.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="form-page-container">
      
      {/* HEADER PAGE */}
      <div className="form-top-bar">
        <h1 className="form-page-title">Buku Tamu & RSVP</h1>
        {/* Tombol kembali yang sudah diperbaiki */}
        <Link to={`/kelola-undangan/${slug}`}>
          <button className="btn-back">← Kembali</button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* 1. STATISTIK GRID DINAMIS */}
        <div className="rsvp-stats-grid">
          <div className="stat-card-purple">
            <h3 className="stat-num-purple">{totalUcapan}</h3>
            <p className="stat-label-purple">Total Ucapan</p>
          </div>
          <div className="stat-card-green">
            <h3 className="stat-num-green">{hadirCount}</h3>
            <p className="stat-label-green">Akan Hadir</p>
          </div>
          <div className="stat-card-red">
            <h3 className="stat-num-red">{tidakHadirCount}</h3>
            <p className="stat-label-red">Berhalangan</p>
          </div>
        </div>

        {/* 2. AREA KONTROL (FILTER & SEARCH) */}
        <div className="rsvp-controls-area">
          <div className="rsvp-filter-group">
            {/* Ubah 'Ragu-ragu' menjadi 'Masih Ragu' */}
            {['Semua', 'Hadir', 'Tidak', 'Masih Ragu'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`filter-btn ${filter === tab ? 'active' : 'inactive'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="rsvp-search-wrapper">
            <input 
              type="text" 
              placeholder="Cari nama tamu..." 
              className="rsvp-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Mengubah state pencarian
            />
            <span className="rsvp-search-icon">🔍</span>
          </div>
        </div>

        {/* 3. LIST DAFTAR UCAPAN */}
        <div>
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Memuat data ucapan...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="rsvp-empty-state text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              Tidak ada ucapan ditemukan.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="guest-card">
                <div className="guest-header">
                  <div className="guest-info">
                    <div className="guest-avatar">
                      {/* Gunakan msg.nama_pengirim */}
                      {msg.nama_pengirim ? msg.nama_pengirim.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h4 className="guest-name">{msg.nama_pengirim}</h4>
                      <span className="guest-date">{formatDate(msg.createdAt)}</span>
                    </div>
                  </div>

                  <span className={`status-badge ${
                    msg.konfirmasi_hadir === 'Hadir' ? 'status-hadir' : 
                    msg.konfirmasi_hadir === 'Tidak Hadir' ? 'status-tidak' : 'status-ragu'
                  }`}>
                    {msg.konfirmasi_hadir === 'Hadir' && '✅ '}
                    {msg.konfirmasi_hadir === 'Tidak Hadir' && '❌ '}
                    {msg.konfirmasi_hadir === 'Masih Ragu' && '❓ '}
                    {msg.konfirmasi_hadir}
                  </span>
                </div>

                <div className="guest-message-box">
                   {/* Gunakan msg.pesan */}
                   "{msg.pesan}"
                </div>

                {/* <div className="guest-message-box">
                   "{msg.ucapan}"
                </div> */}

                <div className="guest-footer">
                  <button onClick={() => handleDelete(msg.id)} className="btn-delete-rsvp text-red-500 hover:text-red-700 text-sm font-semibold">
                    🗑 Hapus Ucapan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default RsvpEditor;