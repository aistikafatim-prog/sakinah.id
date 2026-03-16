import React from 'react';
import '../styles/Keunggulan.css';

export default function Keunggulan(){
    const daftarKeunggulan =[
      {
      judul: "Desain Eksklusif & Modern",
      deskripsi: "Banyak pilihan tema eksklusif yang selalu mengikuti tren, cocok untuk berbagai konsep acara: minimalis, floral, elegan hingga adat Nusantara.",
      img: "https://img.freepik.com/free-vector/wedding-planner-concept-illustration_114360-2593.jpg?w=740" 
    },
    {
      judul: "Edit Mudah Tanpa Skill",
      deskripsi: "Ubah teks, foto, musik dan detail acara hanya dengan beberapa klik. Tidak perlu software rumit atau kemampuan desain khusus.",
      img: "https://img.freepik.com/free-vector/content-creator-concept-illustration_114360-3793.jpg?w=740"
    },
    {
      judul: "Personalisasi Tamu Undangan",
      deskripsi: "Setiap tamu bisa dipanggil namanya langsung di undangan + QR Code unik, membuat mereka merasa lebih dihargai dan istimewa.",
      img: "https://img.freepik.com/free-vector/wedding-invitation-concept-illustration_114360-2612.jpg?w=740"
    }
  ];
  return (
    <section id="keunggulan" className="blok-keunggulan">
      <div className="batas-keunggulan">
        
        <div className="kepala-keunggulan">
          <h2 className="judul-section">
            Kenapa Ratusan Ribu Pasangan Memilih Sakinah.id ?
          </h2>
        </div>

        <div className="grid-keunggulan">
          {daftarKeunggulan.map((item, index) => (
            <div key={index} className="kartu-keunggulan">
              <img 
                src={item.img} 
                alt={item.judul} 
                className="gambar-ilustrasi"
              />
              <h3 className="judul-kartu">{item.judul}</h3>
              <p className="deskripsi-kartu">{item.deskripsi}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
