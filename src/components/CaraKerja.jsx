import { useState } from 'react';
import '../styles/CaraKerja.css';

export default function CaraKerja() {
  const langkah = [
    { 
      no: 1, 
      judul: "Daftar & Lengkapi Data", 
      deskripsi: "Buat akun dalam hitungan detik. Isi data mempelai, lokasi, waktu acara, dan cerita cintamu di formulir yang tersedia." 
    },
    { 
      no: 2, 
      judul: "Pilih Desain Tema", 
      deskripsi: "Jelajahi puluhan tema premium kami. Pilih yang paling cocok dengan warna dan konsep pernikahanmu (Adat, Modern, atau Minimalis)." 
    },
    { 
      no: 3, 
      judul: "Personalisasi Undangan", 
      deskripsi: "Upload foto pre-wedding, pilih musik latar romantis, dan atur kata-kata sambutan agar terasa lebih personal." 
    },
    { 
      no: 4, 
      judul: "Input Daftar Tamu", 
      deskripsi: "Masukkan nama-nama tamu undanganmu. Sistem kami akan otomatis membuatkan link unik untuk setiap tamu." 
    },
    { 
      no: 5, 
      judul: "Sebarkan & Pantau", 
      deskripsi: "Kirim undangan via WhatsApp. Pantau siapa yang sudah membuka dan konfirmasi kehadiran (RSVP) secara real-time." 
    }
  ];

  return (
    <section id="cara-kerja" className="blok-cara">
      <div className="batas-cara">
        
        {/* HEADER */}
        <div className="kepala-cara">
          <h2 className="judul-cara">
            Langkah Mudah Membuat <br /> Undangan Impian
          </h2>
          <p className="deskripsi-cara">
            Ikuti proses simpel ini dan undanganmu siap disebar.
          </p>
        </div>

        {/* CONTAINER ZIG-ZAG */}
        <div className="wadah-timeline">
          {langkah.map((item, index) => (
            <div key={index} className="item-langkah">
              
              {/* NOMOR (Akan selalu di tengah layar laptop) */}
              <div className="lingkaran-angka">
                {item.no}
              </div>

              {/* KARTU KONTEN */}
              <div className="konten-langkah">
                <h3 className="judul-langkah">{item.judul}</h3>
                <p className="teks-langkah">{item.deskripsi}</p>
              </div>

              {/* DIV KOSONG (Penyeimbang Flexbox) */}
              {/* Ini trik agar Flexbox punya 3 anak: Kiri, Tengah, Kanan */}
              {/* Di layar HP ini disembunyikan */}
              <div className="hidden md:block w-[42%]"></div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}