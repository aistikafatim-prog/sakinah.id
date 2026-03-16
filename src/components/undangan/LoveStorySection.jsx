import React from 'react';
import '../../styles/LoveStorySection.css'; 

// Helper URL Gambar
const imgUrl = (filename) => filename 
  ? `http://localhost:5000/uploads/${filename}` 
  : null;

export default function LoveStorySection({ data }) {
  
  // 1. AMBIL DATA DARI DATABASE (Nama arraynya 'stories')
  const stories = data?.stories || [];

  // 2. HELPER FORMAT TANGGAL
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long' }; // Cth: "Februari 2026"
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Kalau tidak ada cerita di database, jangan tampilkan section ini sama sekali (biar rapi)
  if (stories.length === 0) return null;

  return (
    <section className="story-wrapper">
      <div className="story-card">
        
        <h2 className="story-main-title">Love Story</h2>

        <div className="w-full flex flex-col gap-8">
          {stories.map((item, index) => (
            <div key={index} className="story-item">
              
              {/* --- BAGIAN FOTO --- */}
              {/* Cek apakah user upload foto (item.foto)? */}
              {item.foto ? (
                  <div className="story-image-frame">
                    <img 
                        src={imgUrl(item.foto)} 
                        alt={item.judul} 
                        className="w-full h-full object-cover"
                    />
                  </div>
              ) : (
                  // Opsional: Kalau tidak ada foto, tampilkan ikon hati atau placeholder
                  <div className="story-image-frame bg-pink-100 flex items-center justify-center text-pink-300 text-4xl">
                    💖
                  </div>
              )}
              
              {/* --- BAGIAN TEKS --- */}
              <div className="text-center mt-4 px-4">
                  <h3 className="story-item-title text-xl font-bold text-[#D85D5D] mb-1">
                    {item.judul}
                  </h3>
                  
                  <span className="story-item-date text-xs text-gray-400 font-serif italic block mb-3">
                    {formatDate(item.tanggal)}
                  </span>
                  
                  <p className="story-item-text text-sm text-gray-600 leading-relaxed font-serif">
                    {/* Di database namanya 'deskripsi', bukan 'isi' */}
                    {item.deskripsi}
                  </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}