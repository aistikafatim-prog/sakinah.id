// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import TopBar from '../components/TopBar';
// import axiosClient from '../api/axiosClient';
// import '../styles/Dashboard.css';

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // STATE DATA REAL
//   const [stats, setStats] = useState({ undangan: 0, tamu: 0, tagihan: 0 });
//   const [bills, setBills] = useState([]); // <--- State untuk menyimpan list tagihan
//   const [loading, setLoading] = useState(true);

//   // FUNGSI FORMAT RUPIAH
//   const formatRupiah = (number) => {
//     return new Intl.NumberFormat('id-ID', {
//       style: 'currency',
//       currency: 'IDR',
//       minimumFractionDigits: 0
//     }).format(number);
//   };

//   // FUNGSI FORMAT TANGGAL
//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const options = { day: 'numeric', month: 'long', year: 'numeric' };
//     return new Date(dateString).toLocaleDateString('id-ID', options);
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const dataString = localStorage.getItem('user_sakinah');
//       if (!dataString) {
//         navigate('/login');
//         return;
//       }

//       const userData = JSON.parse(dataString);
//       setUser(userData);

//       try {
//         setLoading(true);

//         // 1. FETCH STATISTIK DASHBOARD
//         const resStats = await axiosClient.get('/dashboard/stats');
//         if (resStats.data.status === 'success') {
//           setStats(resStats.data.data);
//         }

//         // 2. FETCH RIWAYAT TAGIHAN (Endpoint Baru)
//         // Pastikan backend kamu punya route ini
//         const resBills = await axiosClient.get('/billing/history');
//         if (resBills.data.status === 'success') {
//           setBills(resBills.data.data); // Simpan array tagihan ke state
//         }

//       } catch (error) {
//         console.error("Gagal ambil data dashboard:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   if (!user) return null;

//   return (
//     <div className="dashboard-container">
//       <Sidebar />
//       <main className="dashboard-main">
//         <div className="dashboard-content-scroll">
//           <TopBar user={user} />

//           {/* Banner */}
//           <div className="welcome-banner">
//             <div className="banner-text-wrapper">
//               <h2 className="banner-title">Selamat Datang, {user.name} !</h2>
//               <p className="banner-subtitle">Siap melanjutkan pernikahan impianmu ?</p>
//             </div>
//             <div className="banner-decoration"></div>
//           </div>

//           {/* Statistik */}
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-icon">🧾</div>
//               <div className="stat-value">{loading ? "..." : stats.tagihan}</div>
//               <div className="stat-label">Tagihan</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon">💌</div>
//               <div className="stat-value">{loading ? "..." : stats.undangan}</div>
//               <div className="stat-label">Undangan</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon">🖼️</div>
//               <div className="stat-value">{loading ? "..." : stats.tamu}</div>
//               <div className="stat-label">Tamu</div>
//             </div>
//           </div>

//           {/* Bagian Bawah */}
//           <div className="bottom-section">

//             {/* Kiri: Aksi Cepat */}
//             <div className="lg:col-span-1">
//               <h3 className="section-title">Aksi Cepat</h3>
//               <div className="quick-action-card">
//                 <Link to="/template" className="btn-action-primary block text-center mb-3">
//                   Buat Undangan Baru
//                 </Link>
//                 <Link to="/kelola-undangan/:slug" className="btn-action-secondary block text-center">
//                   Kelola Undanganku
//                 </Link>
//               </div>
//             </div>

//             {/* Kanan: Riwayat Tagihan Dinamis */}
//             <div className="lg:col-span-2">
//               <h3 className="section-title">Riwayat Tagihan</h3>

//               <div className="history-card">
//                 <div className="history-table-wrapper">

//                   {/* JIKA LOADING */}
//                   {loading && <p className="text-center py-4 text-gray-400 text-xs">Memuat data...</p>}

//                   {/* JIKA TIDAK LOADING TAPI DATA KOSONG */}
//                   {!loading && bills.length === 0 && (
//                     <div className="text-center py-8">
//                       <p className="text-gray-400 text-sm">Belum ada riwayat tagihan.</p>
//                     </div>
//                   )}

//                   {/* JIKA ADA DATA */}
//                   {!loading && bills.length > 0 && (
//                     <table className="history-table">
//                       <thead>
//                         <tr className="table-header">
//                           <th className="pb-3 px-2">ID</th>
//                           <th className="pb-3 px-2">Item</th>
//                           <th className="pb-3 px-2">Tanggal</th>
//                           <th className="pb-3 px-2">Status</th>
//                           <th className="pb-3 px-2">Harga</th>
//                         </tr>
//                       </thead>
//                       <tbody className="text-gray-700">
//                         {bills.slice(0, 3).map((bill, index) => (
//                           <tr key={index} className="table-row border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">

//                             <td className="py-4 px-2 font-bold text-xs text-gray-500">
//                               #{bill.id || index + 1}
//                             </td>

//                             <td className="py-4 px-2 font-medium">
//                               {bill.nama_paket || "Paket Undangan"}
//                             </td>

//                             <td className="py-4 px-2 text-xs text-gray-500">
//                               {formatDate(bill.createdAt)}
//                             </td>

//                             <td className="py-4 px-2">
//                               {/* Logika Badge Status */}
//                               <span className={`status-badge ${bill.status === 'paid' || bill.status === 'Lunas' ? 'paid' : 'pending'}`}>
//                                 {bill.status}
//                               </span>
//                             </td>

//                             <td className="py-4 px-2 font-bold text-[#D85D5D]">
//                               {formatRupiah(bill.jumlah || bill.harga)}
//                             </td>

//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//                 <div className="history-footer">
//                   <Link to="/tagihan" className="btn-view-all">
//                     Lihat Semua Riwayat Tagihan
//                   </Link>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import axiosClient from '../api/axiosClient';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ undangan: 0, tamu: 0, tagihan: 0 });
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const dataString = localStorage.getItem('user_sakinah');
      if (!dataString) { navigate('/login'); return; }
      setUser(JSON.parse(dataString));

      try {
        setLoading(true);
        const resStats = await axiosClient.get('/dashboard/stats');
        if (resStats.data.status === 'success') setStats(resStats.data.data);

        const resBills = await axiosClient.get('/billing/history');
        if (resBills.data.status === 'success') setBills(resBills.data.data);
      } catch (error) {
        console.error("Gagal ambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-content-scroll">
          <TopBar user={user} />

          {/* Banner */}
          <div className="welcome-banner">
            <div className="banner-text-wrapper">
              <h2 className="banner-title">Selamat Datang, {user.name} !</h2>
              <p className="banner-subtitle">Siap melanjutkan pernikahan impianmu ?</p>
            </div>
            <div className="banner-decoration"></div>
          </div>

          {/* Statistik dengan Icon SVG */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div className="stat-value">{loading ? "..." : stats.tagihan}</div>
              <div className="stat-label">Tagihan</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div className="stat-value">{loading ? "..." : stats.undangan}</div>
              <div className="stat-label">Undangan</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <div className="stat-value">{loading ? "..." : stats.tamu}</div>
              <div className="stat-label">Tamu</div>
            </div>
          </div>

          <div className="bottom-section">
            <div className="lg:col-span-1">
              <h3 className="section-title">Aksi Cepat</h3>
              <div className="quick-action-card">
                <Link to="/template" className="btn-action-primary block text-center mb-3">
                  Buat Undangan Baru
                </Link>
                <Link to="/undangan-saya" className="btn-action-secondary block text-center">
                  Kelola Undanganku
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="section-title">Riwayat Tagihan</h3>
              <div className="history-card">
                <div className="history-table-wrapper">
                  {!loading && bills.length > 0 && (
                    <table className="history-table">
                      <thead>
                        <tr className="table-header">
                          <th className="pb-3 px-2">ID</th>
                          <th className="pb-3 px-2">Item</th>
                          <th className="pb-3 px-2">Tanggal</th>
                          <th className="pb-3 px-2">Status</th>
                          <th className="pb-3 px-2">Harga</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        {bills.slice(0, 3).map((bill, index) => (
                          <tr key={index} className="table-row">
                            <td className="py-4 px-2 font-bold text-xs text-gray-500">#{bill.id || index + 1}</td>
                            <td className="py-4 px-2 font-medium">{bill.nama_paket || "Paket Undangan"}</td>
                            <td className="py-4 px-2 text-xs text-gray-500">{formatDate(bill.createdAt)}</td>
                            <td className="py-4 px-2">
                              <span className={`status-badge ${bill.status === 'paid' || bill.status === 'Lunas' ? 'paid' : 'pending'}`}>
                                {bill.status}
                              </span>
                            </td>
                            <td className="py-4 px-2 font-bold text-[#D85D5D]">{formatRupiah(bill.jumlah || bill.harga)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="history-footer">
                  <Link to="/tagihan" className="btn-view-all">
                    Lihat Semua Riwayat Tagihan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}