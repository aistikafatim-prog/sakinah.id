import React from 'react';
import '../../styles/ClosingSection.css'; 

export default function ClosingSection({ data }) {
  // 1. TAMBAHKAN FUNGSI imgUrl DI SINI AGAR TIDAK ERROR
  // Jika user belum upload cover_foto, kita beri gambar default agar web tidak rusak
  const imgUrl = (filename) => {
    return filename 
      ? `http://localhost:5000/uploads/${filename}` 
      : 'https://via.placeholder.com/400x500?text=Foto+Cover'; 
  };

  // 2. Ambil Data Mempelai
  const pria = data?.mempelai?.pria_panggilan || "Groom";
  const wanita = data?.mempelai?.wanita_panggilan || "Bride";

  return (
    <section className="closing-wrapper">
      <div className="closing-card">
        
        {/* FOTO PENUTUP (Sekarang otomatis sama persis dengan Hero Section) */}
        <div className="closing-image-frame">
            <img src={imgUrl(data?.cover_foto)} alt="Couple Closing" />
        </div>

        {/* KATA-KATA PENUTUP */}
        <p className="closing-text">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, 
          berkenan hadir dan memberikan do'a restu kepada kedua mempelai.
        </p>

        {/* SALAM & NAMA */}
        <p className="closing-salam">Hormat Kami Yang Mengundang</p>
        
        <h2 className="closing-couple">
          {wanita} & {pria}
        </h2>

        {/* GARIS HIAS KECIL */}
        <div className="w-10 h-1 bg-[#D85D5D] rounded-full opacity-30 mx-auto my-4"></div>

        {/* FOOTER CREDIT (Opsional) */}
        <div className="footer-credit">
            <p>Created with Love by Sakinah.id</p>
            {data?.audio && <p className="mt-1 text-[8px] lowercase">Sound on ♪</p>}
        </div>

      </div>
    </section>
  );
}