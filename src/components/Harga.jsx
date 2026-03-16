import React from 'react';
import '../styles/Harga.css';

export default function Harga() {
  return (
    <section id="harga" className="blok-harga">
      <div className="batas-harga">
        
        {/* HEADER */}
        <div className="kepala-harga">
          <h2 className="judul-harga">Harga</h2>
          <p className="sub-judul-harga">
            Mulai dari Rp0, pilih paket undangan digital pernikahan yang paling pas dengan kebutuhanmu. 
            Sekali bayar, undangan aktif selamanya*.
          </p>
        </div>

        {/* GRID 2 KARTU */}
        <div className="grid-harga">
          
          {/* === KARTU 1: GRATIS === */}
          <div className="kartu-harga">
            <div className="label-atas">Coba Dulu</div>
            <h3 className="nama-paket">Gratis</h3>
            
            {/* Kotak Harga Abu-abu */}
            <div className="kotak-harga kotak-abu">
              <div className="teks-nominal">Rp. 0</div>
              <div className="teks-promo">Promo Sampai 31 Januari 2026</div>
            </div>

            <ul className="list-fitur">
              <li className="item-fitur-harga">1 Undangan Standar</li>
              <li className="item-fitur-harga">Aktif 1 Bulan</li>
              <li className="item-fitur-harga">Kuota Tamu Terbatas</li>
              <li className="item-fitur-harga">Galeri Foto & Video Terbatas</li>
              <li className="item-fitur-harga">Musik Latar</li>
              <li className="item-fitur-harga">Ucapan & Do'a</li>
              <li className="item-fitur-harga text-gray-400 line-through">Pilihan Tema Premium</li>
            </ul>

            <div className="area-tombol-harga">
              <button className="btn-harga-outline">Daftar Gratis</button>
            </div>
          </div>

          {/* === KARTU 2: PREMIUM (FAVORIT) === */}
          <div className="kartu-harga  translate"> 
            {/* md:-translate-y-4 membuat kartu ini sedikit lebih naik (menonjol) */}
            
            <div className="label-atas text-rose-700 font-black">Paling Favorit</div>
            <h3 className="nama-paket">Premium</h3>
            
            {/* Kotak Harga Merah Marun */}
            <div className="kotak-harga kotak-merah relative overflow-hidden">
              {/* Efek Kilau (Opsional) */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-10 rotate-45"></div>
              
              <div className="teks-nominal">Rp. 79K</div>
              <div className="teks-promo">Promo Sampai 31 Januari 2026</div>
            </div>

            <ul className="list-fitur">
              <li className="item-fitur-harga font-bold text-gray-900">1 Undangan Premium</li>
              <li className="item-fitur-harga font-bold text-gray-900">Unlimited Kuota Tamu</li>
              <li className="item-fitur-harga font-bold text-gray-900">Unlimited Galeri Foto & Video</li>
              <li className="item-fitur-harga">Musik Latar</li>
              <li className="item-fitur-harga">Ucapan & Do'a</li>
              <li className="item-fitur-harga">Bebas Pilih Tema Premium</li>
              <li className="item-fitur-harga">Kado Cashless</li>
              <li className="item-fitur-harga">Layar Penerima Tamu</li>
              <li className="item-fitur-harga">Story Instagram</li>
            </ul>

            <div className="area-tombol-harga">
              <button className="btn-harga-solid">Pilih Paket Premium</button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}