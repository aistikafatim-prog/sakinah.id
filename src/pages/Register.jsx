import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [nama_lengkap, setNamaLengkap] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Pastikan form bersih saat halaman dibuka
  useEffect(() => {
    setNamaLengkap('');
    setEmail('');
    setPassword('');
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const respon = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_lengkap, email, password }),
      });
      const hasil = await respon.json();

      if (respon.ok) {
        alert("Pendaftaran Berhasil! Silakan Login.");
        navigate('/login');
      } else {
        alert(hasil.message || "Gagal Mendaftar");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server");
    }
    setLoading(false);
  };

  return (
    <div className="halaman-register">
      <div className="dekorasi-kiri-register"></div>

      <div className="kartu-register">
        <div className="header-register">
          <h2 className="judul-register">Buat Akun</h2>
          <p className="subjudul-register">Bergabung dengan Sakinah.id</p>
        </div>

        {/* 2. Matikan autocomplete di level Form */}
        <form onSubmit={handleRegister} autoComplete="off">
          
          <div className="grup-input-register">
            <input 
              type="text" 
              className="input-register" 
              placeholder="Nama Lengkap"
              value={nama_lengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
              autoComplete="off" // Matikan autofill nama
            />
          </div>
          
          <div className="grup-input-register">
            <input 
              type="email" 
              className="input-register" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off" // Matikan autofill email
              name="email_register_new" // Ganti nama field biar browser bingung (opsional)
            />
          </div>

          <div className="grup-input-register">
            <input 
              type="password" 
              className="input-register" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // 3. INI SOLUSINYA: Gunakan 'new-password'
              // Browser akan paham ini adalah pembuatan password baru
              // sehingga dia tidak akan mengisi password lama.
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="tombol-register" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="area-link-masuk">
          Sudah punya akun? <Link to="/login" className="link-masuk">Masuk disini</Link>
        </div>
      </div>
    </div>
  );
}