import React, { useState, useEffect } from 'react';
import '../../styles/StreamingSection.css'; 

export default function StreamingSection({ data }) {
  // === 1. PERBAIKAN PENGAMBILAN DATA ===
  const acara = data?.acara || {}; // Ambil objek acara dulu

  // FIX: Link streaming ada di dalam tabel ACARA, bukan di root data
  const linkStreaming = acara.link_streaming || "#"; 
  
  // Cek Setting (Default True jika belum ada setting)
  const isEnabled = data?.settings?.show_streaming !== false;

  // === 2. LOGIKA WAKTU ===
  // Prioritas: Resepsi -> Akad -> Default
  const tgl = acara.resepsi_tanggal || acara.akad_tanggal;
  const jam = acara.resepsi_waktu || acara.akad_waktu || "08:00"; // Hapus detik biar aman
  
  // Format Tanggal: "2026-06-26T08:00"
  // Pastikan jam hanya HH:MM (kadang backend kirim HH:MM:SS)
  const jamClean = jam.length > 5 ? jam.substring(0, 5) : jam;
  const targetDateStr = tgl ? `${tgl}T${jamClean}` : null;

  // State Status
  const [status, setStatus] = useState('upcoming'); // 'upcoming', 'live', 'past'

  // === 3. HITUNG MUNDUR / CEK STATUS ===
  useEffect(() => {
    if (!targetDateStr) return;

    const checkTime = () => {
        const now = new Date().getTime();
        const eventDate = new Date(targetDateStr);
        const eventTime = eventDate.getTime();
        
        // Validasi: Kalau tanggal tidak valid, stop
        if (isNaN(eventTime)) return;

        // Durasi Live dianggap 4 jam
        const durasiLive = 4 * 60 * 60 * 1000; 

        if (now >= eventTime && now <= eventTime + durasiLive) {
            setStatus('live'); 
        } else if (now > eventTime + durasiLive) {
            setStatus('past'); 
        } else {
            setStatus('upcoming'); 
        }
    };

    checkTime(); 
    const timer = setInterval(checkTime, 60000); // Cek tiap 1 menit
    return () => clearInterval(timer);
  }, [targetDateStr]);

  // Handler Klik
  const handleClick = (e) => {
    if (linkStreaming === "#" || !linkStreaming) {
        e.preventDefault();
        alert("Link streaming belum diisi oleh pengantin.");
        return;
    }

    if (status === 'upcoming') {
        const confirm = window.confirm(
            "Acara belum dimulai. Channel mungkin belum menayangkan apa-apa. Tetap ingin membuka?"
        );
        if (!confirm) e.preventDefault();
    }
  };

  // Kalau dimatikan dari dashboard atau Tanggal belum diisi, sembunyikan section ini
  if (!isEnabled || !targetDateStr) return null;

  return (
    <section className="streaming-wrapper">
      <div className="streaming-card">
        
        <h2 className="streaming-title">Live Streaming</h2>

        <p className="streaming-text">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i 
          berkenan hadir memberikan doa restu secara virtual.
        </p>

        {/* --- STATUS TAMPILAN --- */}
        <div className="mb-6 flex flex-col items-center gap-1">
            
            {status === 'live' && (
                <div className="flex items-center gap-2 text-red-600 animate-pulse bg-red-100 px-3 py-1 rounded-full">
                    <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                    <span className="text-xs font-bold uppercase tracking-widest">Sedang Berlangsung</span>
                </div>
            )}

            {status === 'upcoming' && (
                <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Segera Tayang</span>
                </div>
            )}

            {status === 'past' && (
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Siaran Berakhir</span>
                </div>
            )}
        </div>

        {/* --- TOMBOL --- */}
        <a 
          href={linkStreaming} 
          target="_blank" 
          rel="noreferrer"
          onClick={handleClick}
          className={`btn-streaming ${
            status === 'live' ? 'btn-live' : 
            status === 'upcoming' ? 'btn-upcoming' : 'btn-past'
          }`}
        >
          {status === 'live' && "🔴 Tonton Sekarang"}
          {status === 'upcoming' && "🎥 Kunjungi Channel"}
          {status === 'past' && "🎬 Tonton Siaran Ulang"}
        </a>

        {/* INFO WAKTU */}
        {status === 'upcoming' && (
            <p className="text-[10px] text-gray-400 mt-4 italic">
                *Live dimulai pada: {new Date(targetDateStr).toLocaleDateString('id-ID', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
            </p>
        )}

      </div>
    </section>
  );
}