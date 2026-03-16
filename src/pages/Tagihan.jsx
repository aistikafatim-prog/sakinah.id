import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import axiosClient from "../api/axiosClient";
import "../styles/Tagihan.css";

const Tagihan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // State dipisah: Pending (Belum Bayar) vs History (Sudah Bayar)
  const [pendingBills, setPendingBills] = useState([]);
  const [historyBills, setHistoryBills] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // ID tagihan yang sedang diproses

  // 1. Cek Login
  useEffect(() => {
    const dataString = localStorage.getItem("user_sakinah");
    if (!dataString) {
      navigate("/login");
    } else {
      setUser(JSON.parse(dataString));
      fetchTagihan();
    }
  }, [navigate]);

  // 2. Ambil Semua Data & Pisahkan
  const fetchTagihan = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/billing/history');
      
      if (res.data.status === 'success') {
        const allData = res.data.data;

        // FILTER: Pisahkan yang PENDING dan yang SUDAH SELESAI
        const pending = allData.filter(item => item.status === 'pending');
        const history = allData.filter(item => item.status !== 'pending');

        setPendingBills(pending);
        setHistoryBills(history);
      }
    } catch (error) {
      console.error("Gagal ambil tagihan:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fungsi Bayar Spesifik (Menerima ID Tagihan)
  const handleBayar = async (tagihan) => {
    const yakin = window.confirm(`Bayar tagihan "${tagihan.nama_paket}" seharga ${formatRupiah(tagihan.jumlah)}?`);
    if (!yakin) return;

    setProcessingId(tagihan.id); // Set loading khusus untuk kartu ini
    
    try {
        const res = await axiosClient.post('/billing/pay', {
            tagihan_id: tagihan.id
        });

        if (res.data.status === 'success') {
            alert("✅ Pembayaran Berhasil!");
            fetchTagihan(); // Refresh data otomatis
        }
    } catch (error) {
        console.error("Gagal bayar:", error);
        alert("Gagal memproses pembayaran.");
    } finally {
        setProcessingId(null);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="tagihan-page-container">
      <Sidebar />
      <main className="tagihan-main-wrapper">
        <div className="tagihan-scroll-area">
          <TopBar user={user} />
          <h1 className="tagihan-header-title">Tagihan & Riwayat</h1>

          {loading && <p className="text-center mt-5">Memuat data...</p>}

          {/* --- BAGIAN 1: TAGIHAN BELUM DIBAYAR (List Card) --- */}
          {!loading && (
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-700 border-l-4 border-[#581c4f] pl-3">
                    Perlu Dibayar ({pendingBills.length})
                </h2>

                {pendingBills.length === 0 ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-700">
                        🎉 Tidak ada tagihan tertunggak. Kamu aman!
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {pendingBills.map((bill) => (
                            <div key={bill.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-[#581c4f]">{bill.nama_paket}</h3>
                                        <p className="text-xs text-gray-500">Invoice #{bill.id}</p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold uppercase">
                                        Pending
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-lg font-bold text-gray-800">
                                        {formatRupiah(bill.jumlah)}
                                    </div>
                                    
                                    {/* TOMBOL BAYAR SPESIFIK */}
                                    <button 
                                        onClick={() => handleBayar(bill)}
                                        disabled={processingId === bill.id}
                                        className="bg-[#581c4f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#7a266e] transition-colors disabled:opacity-50"
                                    >
                                        {processingId === bill.id ? "Memproses..." : "Bayar Sekarang"}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Dibuat pada: {formatDate(bill.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          {/* --- BAGIAN 2: RIWAYAT PEMBAYARAN (Tabel) --- */}
          {!loading && historyBills.length > 0 && (
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-700 border-l-4 border-gray-400 pl-3">
                    Riwayat Transaksi
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Item</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Tanggal Bayar</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyBills.map((bill) => (
                                <tr key={bill.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-700">{bill.nama_paket}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {bill.payment_date ? formatDate(bill.payment_date) : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            bill.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {bill.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-700">
                                        {formatRupiah(bill.jumlah)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Tagihan;