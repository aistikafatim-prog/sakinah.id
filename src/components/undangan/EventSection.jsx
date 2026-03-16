import React from 'react';
import '../../styles/EventSection.css'; 

export default function EventSection({ data }) {
  // 1. AMBIL DATA DARI DATABASE
  const acara = data?.acara || {};

  // 2. HELPER: FORMAT TANGGAL INDONESIA (Contoh: Minggu, 26 Juni 2026)
  const formatTanggal = (dateString) => {
    if (!dateString) return "Belum Ditentukan";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // 3. HELPER: FORMAT JAM (Hapus detik, jadi 08:00 WIB)
  const formatJam = (timeString) => {
    if (!timeString) return "00:00";
    // Ambil 5 karakter pertama (HH:MM)
    return timeString.substring(0, 5) + " WIB";
  };

  // 4. HELPER: GABUNG ALAMAT LENGKAP
  const alamatLengkap = [
    acara.desa, 
    acara.kecamatan, 
    acara.provinsi
  ].filter(Boolean).join(", "); // Gabung dengan koma, hapus yang kosong

  // 5. HELPER: GENERATE LINK GOOGLE MAPS OTOMATIS
  // Karena di form tidak ada input link maps, kita buat link search
  const generateMapLink = (lokasi) => {
    if (!lokasi) return "#";
    // Format: https://www.google.com/maps/search/?api=1&query=Nama+Gedung
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lokasi + " " + alamatLengkap)}`;
  };

  return (
    <section className="event-wrapper">
      <div className="event-card">
        
        {/* === BAGIAN 1: AKAD NIKAH === */}
        <div className="flex flex-col items-center w-full">
          <h2 className="event-title">Akad Nikah</h2>
          
          <p className="event-date">
            {formatTanggal(acara.akad_tanggal)}
          </p>
          <p className="event-date font-normal text-xs mt-1">
            Pukul {formatJam(acara.akad_waktu)}
          </p>
          
          <div className="event-location mt-4 text-center px-4">
            {/* Karena di form tidak ada input khusus 'Tempat Akad', 
                kita pakai logika: Kalau Resepsi Lokasi ada, pakai itu. */}
            <span className="font-bold block text-lg mb-1">
                {acara.resepsi_lokasi || "Lokasi Akad"}
            </span>
            <span className="text-sm text-gray-600 block leading-relaxed">
                {alamatLengkap}
            </span>
          </div>

          <a 
            href={generateMapLink(acara.resepsi_lokasi)} 
            target="_blank" 
            rel="noreferrer"
            className="btn-maps mt-4"
          >
            📍 Lihat Lokasi
          </a>
        </div>

        {/* Divider visual antar acara */}
        <div className="event-divider my-8 border-b-2 border-dashed border-[#D85D5D]/30 w-1/2 mx-auto"></div>

        {/* === BAGIAN 2: RESEPSI === */}
        <div className="flex flex-col items-center w-full">
          <h2 className="event-title">Resepsi</h2>
          
          <p className="event-date">
             {formatTanggal(acara.resepsi_tanggal)}
          </p>
          <p className="event-date font-normal text-xs mt-1">
             Pukul {formatJam(acara.resepsi_waktu)}
          </p>
          
          <div className="event-location mt-4 text-center px-4">
            <span className="font-bold block text-lg mb-1">
                {acara.resepsi_lokasi || "Lokasi Resepsi"}
            </span>
            <span className="text-sm text-gray-600 block leading-relaxed">
                {alamatLengkap}
            </span>
          </div>

          <a 
            href={generateMapLink(acara.resepsi_lokasi)} 
            target="_blank" 
            rel="noreferrer"
            className="btn-maps mt-4"
          >
            📍 Lihat Lokasi
          </a>
        </div>

      </div>
    </section>
  );
}