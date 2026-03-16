import React from 'react';
import '../styles/MobileApp.css';

export default function MobileApp() {
  return (
    <section id="download" className="blok-mobile">
      <div className="batas-mobile">
        
        <div className="grid-mobile">
          
          {/* === KOLOM KIRI: TEKS === */}
          <div>
            <h2 className="judul-mobile">
              Sakinah.id Kini Tersedia dalam Aplikasi Mobile
            </h2>
            <p className="deskripsi-mobile">
              Kelola, edit, dan pantau undangan langsung dari smartphone — praktis, 
              cepat, dan dengan fitur yang sama lengkap seperti versi web.
            </p>

            {/* Tombol Download */}
            <div className="grup-tombol-dl">
              
              {/* Tombol 1: Web App */}
              <button className="btn-download">
                {/* Ikon Globe/Web */}
                <svg xmlns="http://www.w3.org/2000/svg" className="ikon-dl" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div className="teks-btn-dl">
                  <span className="label-kecil">Install</span>
                  <span className="label-besar">Web App</span>
                </div>
              </button>

              {/* Tombol 2: Google Play */}
              <button className="btn-download">
                {/* Ikon Play Store (Pesawat Kertas style) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="ikon-dl" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3.135a1 1 0 0 1 1.76-.474l13.585 14.5a1 1 0 0 1 .15 1.096l-13.79 8.718A1 1 0 0 1 5 26.04V3.135z" transform="scale(0.8) translate(2,2)" /> 
                  {/* (Ikon Play Store sederhana pakai path segitiga) */}
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l19 9-19 9V3z" />
                </svg>
                <div className="teks-btn-dl">
                  <span className="label-kecil">Tersedia di</span>
                  <span className="label-besar">Google Play</span>
                </div>
              </button>

            </div>

            <div className="info-iphone">
              Pengguna iPhone tetap dapat mengakses undangan dan fitur Sakinah.id 
              dengan nyaman melalui browser di <strong>sakinah.id.com</strong>.
            </div>
          </div>

          {/* === KOLOM KANAN: HP === */}
          <div className="area-hp-mobile">
            <div className="frame-hp-apps">
              {/* Gambar Layar Aplikasi (Screenshot Dashboard/Home) */}
              {/* Saya pakai screenshot placeholder yang mirip dashboard aplikasi */}
              <img 
                src="../images/bashboard mobile.PNG" 
                alt="Aplikasi Mobile" 
                className="layar-apps"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}