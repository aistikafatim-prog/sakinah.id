import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer>
      
      {/* === BAGIAN 1: STORY BEHIND (Upgrade) === */}
      <section id="tentang" className="blok-story">
        <div className="batas-story">
          
          {/* KIRI: Foto Founder (Ganti src dengan foto aslimu) */}
          <div className="wadah-foto-founder">
            <div className="blob-ungu"></div>
            <img 
              src="../images/me.jpeg" 
              alt="Founder Sakinah.id" 
              className="foto-founder"
            />
          </div>

          {/* KANAN: Cerita & Visi */}
          <div>
            <span className="text-purple-600 font-bold tracking-widest text-sm uppercase">Our Story</span>
            <h2 className="judul-story">
              Berawal dari Tugas PKL, <br/> Kini Melayani Ribuan Pasangan
            </h2>
            <p className="teks-story">
              "Sakinah.id lahir di tahun 2026 dari sebuah kamar kost sederhana. Apa yang bermula sebagai proyek Praktik Kerja Lapangan (PKL), kini tumbuh menjadi platform yang membantu ribuan calon pengantin mewujudkan undangan impian mereka dengan hemat dan praktis."
            </p>
            <div className="quote-founder">
              "Misi kami sederhana: Memastikan setiap pasangan bisa membagikan kabar bahagia mereka dengan cara yang paling indah, tanpa harus mahal."
            </div>
          </div>

        </div>
      </section>


      {/* === BAGIAN 2: FOOTER UTAMA (Deep Purple) === */}
      <div className="blok-footer">
        <div className="batas-footer">

          {/* KOLOM 1: BRAND & SOSMED */}
          <div className="md:col-span-1">
<a href="#" className="logo-footer">
              <img 
                src="/images/sakinah.id.jpeg"  // Ganti sesuai nama file logomu
                alt="Logo Sakinah" 
                className="h-10 w-auto object-contain" // Atur tinggi logo disini
              />
            </a>
            <p className="deskripsi-footer">
              Solusi undangan digital website custom. Bebaskan imajinasimu, buat desain undangan yang memukau hanya menggunakan telepon pintar kamu.
            </p>
            
            {/* Social Media Icons */}
            <div className="sosmed-container">
              {/* Instagram */}
              <a href="#" className="icon-sosmed">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="icon-sosmed">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/></svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="icon-sosmed">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/></svg>
              </a>
            </div>
          </div>

          {/* KOLOM 2: MENU */}
          <div>
            <h4 className="judul-kolom-footer">Menu Pintar</h4>
            <ul className="list-menu-footer">
              <li><a href="#beranda" className="link-footer">Beranda</a></li>
              <li><a href="#tema" className="link-footer">Katalog Tema</a></li>
              <li><a href="#harga" className="link-footer">Daftar Harga</a></li>
              <li><a href="#testimoni" className="link-footer">Apa Kata Mereka</a></li>
            </ul>
          </div>

          {/* KOLOM 3: LEGAL */}
          <div>
            <h4 className="judul-kolom-footer">Informasi</h4>
            <ul className="list-menu-footer">
              <li><a href="#" className="link-footer">Syarat & Ketentuan</a></li>
              <li><a href="#" className="link-footer">Kebijakan Privasi</a></li>
              <li><a href="#" className="link-footer">Panduan Pengguna</a></li>
              <li><a href="#" className="link-footer">FAQ</a></li>
            </ul>
          </div>

          {/* KOLOM 4: ALAMAT & KONTAK */}
          <div>
            <h4 className="judul-kolom-footer">Hubungi Kami</h4>
            <ul className="list-kontak">
              <li className="item-kontak">
                {/* Icon Map */}
                <svg className="w-6 h-6 shrink-0 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>
                  Jalan Bengawan Solo, Gang Baru No. 9, RT.3/RW.3, Pakunden, Kota Blitar, 66121
                </span>
              </li>
              <li className="item-kontak">
                {/* Icon Email */}
                <svg className="w-6 h-6 shrink-0 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>support@sakinah.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT BAR */}
        <div className="copyright">
          &copy; {new Date().getFullYear()} Sakinah.id (ASJK24). All rights reserved. Made with 💜 in Blitar.
        </div>
      </div>

    </footer>
  );
}