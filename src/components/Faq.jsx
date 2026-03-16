import React, { useState } from 'react';
import '../styles/Faq.css';

export default function Faq() {
  // State untuk melacak ID pertanyaan mana yang kebuka (null = tutup semua)
  const [aktifId, setAktifId] = useState(0); 

  const daftarFaq = [
    {
      tanya: "Apakah Sakinah.id gratis digunakan?",
      jawab: "Ya, Sakinah.id menyediakan paket gratis selamanya dengan fitur dasar dan pilihan tema yang terbatas. Anda bisa membuat undangan tanpa biaya sepeserpun. Untuk fitur yang lebih lengkap (seperti Custom Musik, Galeri Unlimited, dan Hapus Watermark), Anda dapat memilih paket Premium."
    },
    {
      tanya: "Bagaimana cara upgrade paket ke Premium?",
      jawab: "Sangat mudah! Setelah login ke dashboard, pilih undangan yang ingin di-upgrade, lalu klik tombol 'Upgrade Premium'. Anda bisa melakukan pembayaran via Transfer Bank, E-Wallet (OVO, GoPay, Dana), atau QRIS. Akun akan otomatis aktif dalam hitungan detik."
    },
    {
      tanya: "Apakah bisa mengganti desain undangan ketika sudah dibuat?",
      jawab: "Tentu saja! Anda bebas mengganti template kapan saja tanpa harus mengulang isi data. Cukup masuk ke menu 'Tema', pilih desain baru, dan undangan akan otomatis berubah menyesuaikan tema yang dipilih."
    },
    {
      tanya: "Apakah Sakinah.id menyediakan dukungan pelanggan?",
      jawab: "Ya, tim support kami siap membantu Anda setiap hari (Senin - Minggu) melalui WhatsApp atau Email. Jika Anda mengalami kesulitan saat mengedit atau menyebarkan undangan, jangan ragu untuk menghubungi kami."
    }
  ];

  // Fungsi Toggle (Klik Buka/Tutup)
  const toggleFaq = (index) => {
    // Kalau yang diklik itu udah kebuka, tutup (jadi null). Kalau belum, buka (set index).
    if (aktifId === index) {
      setAktifId(null);
    } else {
      setAktifId(index);
    }
  };

  return (
    <section id="faq" className="blok-faq">
      <div className="batas-faq">
        
        {/* HEADER */}
        <div className="kepala-faq">
          <h2 className="judul-faq">
            FAQ - Pertanyaan yang Sering Diajukan
          </h2>
          <p className="deskripsi-faq">
            Butuh bantuan? Mungkin pertanyaan-pertanyaan berikut bisa menjawab rasa penasaranmu.
          </p>
        </div>

        {/* LIST ACCORDION */}
        <div className="list-faq">
          {daftarFaq.map((item, index) => (
            <div 
              key={index} 
              className={`item-faq ${aktifId === index ? 'aktif' : ''}`}
            >
              
              {/* TOMBOL (HEADER) */}
              <button 
                className="tombol-tanya"
                onClick={() => toggleFaq(index)}
              >
                <span className="teks-tanya">{item.tanya}</span>
                
                {/* Ikon Panah V */}
                <svg xmlns="http://www.w3.org/2000/svg" className="ikon-faq" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* AREA JAWABAN */}
              {/* Style max-height: Kalau aktif tinggi max 200px (atau lebih), kalau tidak 0px */}
              <div 
                className="area-jawab"
                style={{ maxHeight: aktifId === index ? '200px' : '0px' }}
              >
                <div className="isi-jawab">
                  {item.jawab}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}