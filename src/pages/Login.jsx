// import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/Login.css'; 
// import axiosClient from '../api/axiosClient';

// const Login = () => { 
  
//   // 1. STATE
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false); 
  
//   const navigate = useNavigate();

//   // PERBAIKAN 1: Paksa kosongkan form saat halaman pertama kali dibuka
//   useEffect(() => {
//     setEmail('');
//     setPassword('');
//   }, []);

//   // 2. FUNGSI LOGIN
//   const handleLogin = async (e) => {
//     e.preventDefault(); 
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await axiosClient.post('/auth/login', {
//         email: email,
//         password: password
//       });

//       // Simpan Token & User
//       localStorage.setItem('token_sakinah', response.data.token);
//       localStorage.setItem('user_sakinah', JSON.stringify(response.data.user));

//       // PERBAIKAN 2: Kosongkan state sebelum pindah halaman
//       setEmail('');
//       setPassword('');

//       // Pindah ke Dashboard
//       navigate('/dashboard'); 

//     } catch (err) {
//       setError(err.response?.data?.pesan || "Gagal Login. Cek koneksi server.");
//       setLoading(false);
//       // Opsional: Kosongkan password jika gagal biar user ngetik ulang
//       setPassword(''); 
//     }
//   };

//   return (
//     <div className="halaman-login">
//       <div className="dekorasi-kiri-login"></div>

//       <div className="kartu-login">
//         <div className="header-login">
//           <h2 className="judul-login">Sakinah.id</h2>
//           <p className="subjudul-login">Masuk untuk mengelola undangan</p>
//         </div>

//         {error && (
//             <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
//                 {error}
//             </div>
//         )}

//         {/* PERBAIKAN 3: Tambahkan autoComplete="off" di form */}
//         <form onSubmit={handleLogin} autoComplete="off">
          
//           <div className="grup-input-login">
//             <input 
//               type="email" 
//               className="input-login" 
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               // PERBAIKAN 4: Matikan autocomplete email
//               autoComplete="off" 
//               name="email_field_random" // Trik tambahan biar browser bingung
//             />
//           </div>

//           <div className="grup-input-login">
//             <input 
//               type="password" 
//               className="input-login" 
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               // PERBAIKAN 5: Trik paling ampuh! Gunakan 'new-password'
//               autoComplete="new-password"
//               name="password_field_random"
//             />
//           </div>

//           <Link to="/lupa-password" className="lupa-password">
//             Lupa Password?
//           </Link>

//           <button type="submit" className="tombol-login" disabled={loading}>
//             {loading ? 'Memuat...' : 'Masuk'}
//           </button>
//         </form>

//         <div className="area-link-daftar">
//           Belum punya akun? <Link to="/register" className="link-daftar">Daftar Sekarang</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 
import axiosClient from '../api/axiosClient';

const Login = () => { 
  
  // 1. STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  
  const navigate = useNavigate();

  // Kosongkan form saat halaman pertama kali dibuka
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  // 2. FUNGSI LOGIN
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(null);
    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', {
        email: email,
        password: password
      });

      // Simpan Token & User ke Local Storage
      localStorage.setItem('token_sakinah', response.data.token);
      localStorage.setItem('user_sakinah', JSON.stringify(response.data.user));

      // 🚨 POLISI LALU LINTAS: BACA ROLE DARI RESPONSE BACKEND 🚨
      // Kita asumsikan backend sudah mengirimkan data role (seperti yang kita atur sebelumnya)
      const userRole = response.data.user.role; 

      // Kosongkan state sebelum pindah halaman
      setEmail('');
      setPassword('');

      // 🚦 PERCABANGAN NAVIGASI BERDASARKAN ROLE 🚦
      if (userRole === 'admin') {
        navigate('/admin-panel'); // Arahkan Super Admin ke halamannya
      } else {
        navigate('/dashboard'); // Arahkan Member (Klien) ke halamannya
      }

    } catch (err) {
      setError(err.response?.data?.pesan || "Gagal Login. Cek koneksi server.");
      setLoading(false);
      setPassword(''); 
    }
  };

  return (
    <div className="halaman-login">
      <div className="dekorasi-kiri-login"></div>

      <div className="kartu-login">
        <div className="header-login">
          <h2 className="judul-login">Sakinah.id</h2>
          <p className="subjudul-login">Masuk untuk mengelola undangan</p>
        </div>

        {error && (
            <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off">
          
          <div className="grup-input-login">
            <input 
              type="email" 
              className="input-login" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off" 
              name="email_field_random" 
            />
          </div>

          <div className="grup-input-login">
            <input 
              type="password" 
              className="input-login" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              name="password_field_random"
            />
          </div>

          <Link to="/lupa-password" className="lupa-password">
            Lupa Password?
          </Link>

          <button type="submit" className="tombol-login" disabled={loading}>
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <div className="area-link-daftar">
          Belum punya akun? <Link to="/register" className="link-daftar">Daftar Sekarang</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;