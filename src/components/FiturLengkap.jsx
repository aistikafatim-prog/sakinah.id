import React from 'react';
import '../styles/FiturLengkap.css';

export default function FiturLengkap() {
  
  // Data Kolom Kiri (Icon di Kanan)
  const fiturKiri = [
    
    {
      judul: "Background Music",
      deskripsi: "Tambahkan musik latar yang membuat undangan digital kamu terasa lebih hidup dan berkesan.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
        </svg>
      )
    },
    {
      judul: "Terima Kado",
      deskripsi: "Terima kado cashless atau hadiah lainnya dengan mudah melalui fitur pemberian kado digital.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125z" />
        </svg>
      )
    }
  ];

  // Data Kolom Kanan (Icon di Kiri)
  const fiturKanan = [
    
    {
      judul: "Galeri Foto & Video",
      deskripsi: "Tampilkan foto prewedding dan video kenangan terbaik langsung di halaman undangan digital.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      )
    },
    {
      judul: "Kirim via WhatsApp",
      deskripsi: "Kirim undangan digital kamu ke WhatsApp tamu untuk lebih personal dan dekat dengan tamu.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      )
    }
  ];

  return (
    <section id="fitur-lengkap" className="blok-fitur-lengkap">
      <div className="batas-fitur-lengkap">
        
        {/* HEADER */}
        <div className="kepala-fitur-lengkap">
          <h2 className="judul-fitur-lengkap">
            Fitur Lengkap untuk Semua <br /> Kebutuhan Undangan
          </h2>
          <p className="deskripsi-fitur-lengkap">
            Fitur lengkap yang praktis, modern, dan interaktif — siap membantumu 
            membuat undangan yang menarik dan membagikannya kapan saja.
          </p>
        </div>

        {/* GRID 2 KOLOM */}
        <div className="grid-fitur-lengkap">
          
          {/* KOLOM KIRI (Mapping Data Kiri) */}
          <div className="flex flex-col gap-10">
  {fiturKiri.map((item, index) => (
    <div key={index} className="item-fitur item-kiri">
      
      {/* 1. IKON DULUAN (Supaya di HP dia di kiri) */}
      <div className="wadah-ikon">
        {item.icon}
      </div>
      {/* 2. BARU TEKS */}
      <div>
        <h3 className="judul-item-fitur">{item.judul}</h3>
        <p className="deskripsi-item-fitur">{item.deskripsi}</p>
      </div>

    </div>
  ))}
</div>

          {/* KOLOM KANAN (Mapping Data Kanan) */}
          <div className="flex flex-col gap-10">
            {fiturKanan.map((item, index) => (
              <div key={index} className="item-fitur item-kanan">
                {/* Ikon (Di Kiri kalau layar besar) */}
                <div className="wadah-ikon">
                  {item.icon}
                </div>
                {/* Konten Teks */}
                <div>
                  <h3 className="judul-item-fitur">{item.judul}</h3>
                  <p className="deskripsi-item-fitur">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}