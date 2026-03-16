import React, { useState } from 'react';
import '../../styles/GiftSection.css'; 

export default function GiftSection({ data }) {
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' atau 'fisik'

  // 1. AMBIL DATA DARI DATABASE
  // Di backend, data gift biasanya objek tunggal, bukan array (kecuali struktur DB Mbak beda)
  // Kalau struktur DB Mbak: gift = { bank_nama, no_rekening, atas_nama, alamat_lengkap, penerima_paket }
  const giftData = data?.gift || {};

  // Cek apakah data sudah diisi user?
  const hasBankData = giftData.bank_nama && giftData.no_rekening;
  const hasAddressData = giftData.alamat_lengkap;

  // Jika data kosong, kita sembunyikan section ini atau tampilkan pesan "Belum diatur"
  // (Untuk sekarang kita biarkan tampil tapi datanya kosong biar layout gak rusak)

  // Fungsi Salin
  const handleCopy = (text, btnId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    
    const btn = document.getElementById(btnId);
    if(btn) {
        const originalText = btn.innerText;
        btn.innerText = "Berhasil Disalin! ✅";
        btn.classList.add("bg-green-100", "text-green-700", "border-green-300");
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove("bg-green-100", "text-green-700", "border-green-300");
        }, 2000);
    }
  };

  return (
    <section className="gift-wrapper">
      <div className="gift-card">
        
        <h2 className="gift-title">Wedding Gift</h2>
        <p className="gift-text">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
          Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
        </p>

        {/* --- TAB BUTTONS --- */}
        <div className="gift-tabs">
            <button 
                onClick={() => setActiveTab('bank')}
                className={`tab-btn ${activeTab === 'bank' ? 'tab-active' : 'tab-inactive'}`}
            >
                Transfer Bank
            </button>
            <button 
                onClick={() => setActiveTab('fisik')}
                className={`tab-btn ${activeTab === 'fisik' ? 'tab-active' : 'tab-inactive'}`}
            >
                Kirim Kado
            </button>
        </div>

        {/* --- KONTEN: TRANSFER BANK --- */}
        {activeTab === 'bank' && (
            <div className="w-full animate-fade-in">
              {hasBankData ? (
                  <div className="bank-item">
                    <div className="bank-logo font-bold text-xl text-[#D85D5D]">
                        {giftData.bank_nama || "NAMA BANK"}
                    </div>
                    
                    <p className="bank-number text-2xl font-mono tracking-wider my-2">
                        {giftData.no_rekening || "----"}
                    </p>
                    
                    <p className="bank-owner text-sm text-gray-500 mb-4">
                        a.n {giftData.atas_nama || "Nama Pemilik"}
                    </p>
                    
                    <button 
                      id="btn-copy-bank"
                      onClick={() => handleCopy(giftData.no_rekening, "btn-copy-bank")}
                      className="btn-copy"
                    >
                      Salin No. Rekening 📋
                    </button>
                  </div>
              ) : (
                  <div className="text-center py-6 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-xl">
                      Data Rekening belum diisi oleh pengantin.
                  </div>
              )}
            </div>
        )}

        {/* --- KONTEN: KIRIM KADO (ALAMAT) --- */}
        {activeTab === 'fisik' && (
            <div className="w-full animate-fade-in">
                {hasAddressData ? (
                    <div className="address-container">
                        <span className="address-label">Alamat Penerima</span>
                        
                        <p className="address-text">
                            {giftData.alamat_lengkap}
                        </p>
                        
                        <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                            <span className="font-bold block mb-1">Penerima Paket:</span>
                            {giftData.penerima_paket || giftData.atas_nama} 
                        </div>

                        <button 
                            id="btn-copy-alamat"
                            onClick={() => handleCopy(giftData.alamat_lengkap, "btn-copy-alamat")}
                            className="btn-copy"
                        >
                            Salin Alamat Lengkap 📍
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-xl">
                        Alamat kirim kado belum diisi.
                    </div>
                )}
            </div>
        )}

      </div>
    </section>
  );
}