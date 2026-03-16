import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; 
import { useParams } from 'react-router-dom';
import '../../styles/GuestbookSection.css'; 

export default function GuestbookSection({ data }) {
  const { slug } = useParams();

  // --- LOGIKA COUNTDOWN ---
  const calculateTimeLeft = () => {
    const acara = data?.acara || {};
    const tgl = acara.resepsi_tanggal || acara.akad_tanggal;
    const jam = acara.resepsi_waktu || acara.akad_waktu || "08:00:00"; 
    const targetDateStr = tgl ? `${tgl}T${jam}` : "2030-01-01T00:00:00";

    const difference = +new Date(targetDateStr) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Menit: Math.floor((difference / 1000 / 60) % 60),
        Detik: Math.floor((difference / 1000) % 60),
      };
    } else {
        timeLeft = { Hari: 0, Jam: 0, Menit: 0, Detik: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);

  // --- STATE FORM & UI ---
  const [showModal, setShowModal] = useState(false);
  const [nama, setNama] = useState("");
  const [ucapan, setUcapan] = useState("");
  const [hadir, setHadir] = useState("Hadir"); 
  const [jumlah, setJumlah] = useState(1); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. FUNGSI SUBMIT FORM (HANYA POST KE DATABASE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !ucapan) return alert("Mohon isi nama dan ucapan");
    
    if (slug === 'demo') {
        alert("Mode Demo: Fitur kirim dinonaktifkan.");
        return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        nama_pengirim: nama,
        pesan: ucapan,
        konfirmasi_hadir: hadir,
        jumlah_tamu: hadir === 'Hadir' ? parseInt(jumlah) : 0 
      };
      
      await axiosClient.post(`/invitation/${slug}/ucapan`, payload);
      
      setShowModal(false);
      setIsSuccess(true);
      setNama("");
      setUcapan("");
      setHadir("Hadir");
      setJumlah(1);
    } catch (error) {
      console.error("Gagal kirim:", error);
      alert("Gagal mengirim data. Pastikan server menyala.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="guestbook-wrapper" style={{ paddingBottom: '6rem' }}>
      
      {/* === KARTU UTAMA COUNTDOWN & AJAKAN RSVP === */}
      <div className="guestbook-card mx-auto">
        <h2 className="guestbook-title">Rsvp</h2>
        
        {!isSuccess && (
            <div className="countdown-container">
                {['Hari', 'Jam', 'Menit', 'Detik'].map((interval) => (
                    <div key={interval} className="countdown-box">
                        <span className="countdown-val">
                            {timeLeft[interval] !== undefined ? timeLeft[interval] : 0}
                        </span>
                        <span className="countdown-label">{interval}</span>
                    </div>
                ))}
            </div>
        )}

        {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 w-full animate-fade-in mt-4">
                <div className="text-3xl mb-2">💌</div>
                <h3 className="text-[#D85D5D] font-bold text-sm mb-2 font-serif">Terima Kasih!</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                    Konfirmasi kehadiran dan doa restu Anda telah masuk ke sistem kami.
                </p>
            </div>
        ) : (
             <>
                <p className="guestbook-text mt-2">
                    Sampaikan do'a atau salam kepada pengantin dan konfirmasi kehadiran.
                </p>
                <button onClick={() => setShowModal(true)} className="btn-open-modal mt-2">
                    Kirim Ucapan RSVP
                </button>
             </>
        )}
      </div>

      {/* === MODAL POPUP FORM RSVP === */}
      {showModal && (
        <div className="modal-overlay">
            {/* Memaksa lengkungan pop-up menjadi 40px agar persis seperti kartu Rsvp di luar */}
            <div className="modal-content relative" style={{ borderRadius: '40px' }}>
                
                <button onClick={() => setShowModal(false)} className="btn-close">✕</button>

                <div className="text-center mb-6 mt-2">
                    <h3 className="text-2xl font-serif font-bold text-[#D85D5D]">Formulir Kehadiran</h3>
                    <p className="text-[10px] text-gray-400 mt-1">Silakan isi data diri Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col text-left">
                    <div>
                        {/* Menambahkan text-gray-600 agar labelnya abu-abu gelap seperti di desainmu */}
                        <label className="form-label text-gray-600">Nama Lengkap</label>
                        <input 
                            type="text" 
                            placeholder="Nama Anda" 
                            className="form-input" 
                            value={nama} 
                            onChange={(e) => setNama(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                         <label className="form-label text-gray-600">Konfirmasi Kehadiran</label>
                         <div className="flex gap-2">
                             <select className="form-input flex-1" value={hadir} onChange={(e) => setHadir(e.target.value)}>
                                <option value="Hadir">✔️ Saya akan Hadir</option>
                                <option value="Tidak Hadir">❌ Maaf, Tidak Bisa</option>
                                <option value="Masih Ragu">❓ Masih Ragu</option>
                             </select>
                             
                             {hadir === 'Hadir' && (
                                 <input 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    className="form-input w-20 text-center" 
                                    value={jumlah} 
                                    onChange={(e) => setJumlah(e.target.value)} 
                                    placeholder="Jml" 
                                 />
                             )}
                         </div>
                    </div>
                    
                    <div>
                        <label className="form-label text-gray-600">Ucapan & Doa</label>
                        <textarea 
                            placeholder="Tuliskan doa untuk mempelai..." 
                            className="form-input h-24 resize-none" 
                            value={ucapan} 
                            onChange={(e) => setUcapan(e.target.value)} 
                            required
                        ></textarea>
                    </div>

                    {/* Tombol dimodifikasi agar berbentuk rounded-xl, BUKAN bulat lonjong kapsul */}
                    <button 
                        type="submit" 
                        className="w-full mt-6 bg-[#D85D5D] text-white py-3 rounded-xl text-xs font-serif font-bold shadow-lg hover:bg-[#c04d4d] transition-all" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                    </button>
                </form>
            </div>
        </div>
      )}

    </section>
  );
}