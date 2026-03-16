import { useState } from 'react';
import '../styles/Navbar.css'; 
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [buka, setBuka] = useState(false); // Ganti 'isOpen' jadi 'buka' biar konsisten

  return (
    <nav className="nav-blok">
      <div className="nav-batas">
        <div className="nav-baris">
          
          {/* LOGO */}
          <div className="logo-area">
            <img 
              className="logo-img" 
              src="/images/sakinah.id.jpeg" 
              alt="Logo Sakinah" 
            />
          </div>

          {/* MENU PC */}
          <div className="menu-pc">
            <a href="#" className="link">Beranda</a>
            <a href="#tema" className="link">Tema</a>
            <a href="#fitur-lengkap" className="link">Fitur</a>
            <a href="#harga" className="link">Harga</a>
            <a href="#testimoni" className="link">Testimoni</a>
            <a href="#faq" className="link">FAQ</a>
            <a href="#tentang" className="link">Tentang Kami</a>
          </div>

          {/* TOMBOL LOGIN PC */}
          <div className="area-tombol">
            <Link to="/login" className="btn-masuk">
              Login
            </Link>
          </div>

          {/* TOMBOL HP (HAMBURGER) */}
          <div className="tombol-toggle">
            <button onClick={() => setBuka(!buka)} className="ikon-menu">
              {buka ? (
                 // Ikon X
                 <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                 // Ikon Garis Tiga
                 <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* DROPDOWN MENU HP */}
      {buka && (
        <div className="menu-hp">
          <div className="list-hp">
            <a href="#" className="link-hp">Beranda</a>
            <a href="#tema" className="link-hp">Tema</a>
            <a href="#fitur" className="link-hp">Fitur</a>
            <a href="#harga" className="link-hp">Harga</a>
            <a href="#testimoni" className="link-hp">Testimoni</a>
            <a href="#tentang" className="link-hp">Tentang Kami</a>

            <div className="pt-4">
               <button className="btn-masuk-hp">
                 <Link to="/login" className="btn-masuk">
              Login
            </Link>
               </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}