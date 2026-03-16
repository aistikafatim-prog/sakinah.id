import { useState } from 'react';
import '../styles/Kado.css';

export default function Kado() {
  const dataKado = [
    {
      judul: "Kado Cashless",
      img: "https://img.freepik.com/free-vector/digital-wallet-concept-illustration_114360-7561.jpg?w=740&t=st=1706600000~exp=1706600600~hmac=xxxxx",
      deskripsi: "Terima hadiah berupa uang secara langsung dan instan ke rekeningmu. Mudah bagi tamu tanpa harus repot menyiapkan amplop atau uang cash. Kamu bisa menerima hadiah kapan saja dengan mudah."
    },
    {
      judul: "Kirim Ke Alamat",
      img: "https://img.freepik.com/free-vector/delivery-service-illustrated_23-2148505081.jpg?w=740&t=st=1706600000~exp=1706600600~hmac=xxxxx",
      deskripsi: "Tamu dapat mengirimkan hadiah fisik langsung ke alamat rumah atau venue acara—cocok untuk hadiah berukuran besar atau barang-barang spesial yang ingin diberikan secara langsung."
    }
  ];

  return (
    <section id="kado" className="blok-kado">
      <div className="batas-kado">
        
        {/* HEADER */}
        <div className="kepala-kado">
          <h2 className="judul-kado">
            Cara Baru Menerima Kado Dengan <br /> Lebih Mudah
          </h2>
          <p className="deskripsi-kado">
            Dua pilihan pemberian kado yang fleksibel dan memudahkan tamu.
          </p>
        </div>

        {/* GRID KARTU */}
        <div className="grid-kado">
          {dataKado.map((item, index) => (
            <div key={index} className="kartu-kado">
              
              {/* Judul di Pojok Kiri Atas Kartu */}
              <h3 className="judul-kartu-kado">{item.judul}</h3>
              
              {/* Gambar Tengah */}
              <img 
                src={item.img} 
                alt={item.judul} 
                className="img-kado"
              />
              
              {/* Deskripsi */}
              <p className="teks-kartu-kado">{item.deskripsi}</p>
            
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}