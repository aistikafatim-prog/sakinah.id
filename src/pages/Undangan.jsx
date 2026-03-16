import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import QRCode from "react-qr-code";
import axiosClient from '../api/axiosClient';
import { Helmet } from 'react-helmet';
import '../styles/Undangan.css';

// IMPORT KOMPONEN TEMPLATE
import HeroSection from '../components/undangan/HeroSection';
import CoupleSection from '../components/undangan/CoupleSection';
import EventSection from '../components/undangan/EventSection'; 
import LoveStorySection from '../components/undangan/LoveStorySection';
import StreamingSection from '../components/undangan/StreamingSection';
import GiftSection from '../components/undangan/GiftSection';
import GuestbookSection from '../components/undangan/GuestbookSection';
import ClosingSection from '../components/undangan/ClosingSection';

// --- 1. DATA DUMMY (DATA CONTOH) ---
const DATA_CONTOH = {
  theme: 'Classic',
  audio: null,
  mempelai: {
    pria_nama: "groom", 
    pria_panggilan: "Groom", 
    pria_ortu: "Bpk. Mempelai & Ibu Mempelai", 
    pria_ig: "@groom_ig",
    pria_foto: null,

    wanita_nama: "bride", 
    wanita_panggilan:"Bride", 
    wanita_ortu: "Bpk. Mempelai & Ibu Mempelai",
    wanita_ig: "@bride_ig",
    wanita_foto: null
  },
  acara: {
    akad_tanggal: "2024-12-31", 
    akad_waktu: "08:00",
    resepsi_tanggal: "2024-12-31", 
    resepsi_waktu: "11:00",
    resepsi_lokasi: "Gedung Serbaguna Verona",
    provinsi: "Jawa Timur",
    kecamatan: "Kanigoro",
    desa: "Sawentar",
    link_streaming: "https://youtube.com"
  },
  stories: [
    { judul: "Pertemuan Pertama", tanggal: "2020-01-01", deskripsi: "Kami bertemu di pesta topeng keluarga." },
    { judul: "Lamaran", tanggal: "2023-12-31", deskripsi: "Saat malam tahun baru, kami saling mengatakan cinta." }
  ],
  gift: {
    bank_nama: "BCA",
    no_rekening: "1234567890",
    atas_nama: "Bride & Groom",
    penerima_paket: "Bride & Groom",
    alamat_lengkap: "Jl. Cinta Sejati No. 1, Verona"
  },
  // Data default untuk sakelar saat demo
  setting: {
    publikasi: true,
    gunakan_pin: false,
    putar_musik: true,
    tampil_cerita: true,
    tampil_kado: true,
    tampil_streaming: true,
    tampil_bukutamu: true
  }
};

// Fungsi bantu untuk mendapatkan URL gambar (KEMBALI DITAMBAHKAN)
const imgUrl = (filename) => filename ? `http://localhost:5000/uploads/${filename}` : null;

export default function Undangan() {
  const { slug } = useParams();
  
  // STATE DATA
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // STATE UI
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const audioRef = useRef(null);
  
  // STATE KEAMANAN (PIN)
  // const [pinTerbuka, setPinTerbuka] = useState(false);
  // const [inputPin, setInputPin] = useState("");
  // const [errorPin, setErrorPin] = useState(false);

  // Default nama tamu
 const [searchParams] = useSearchParams();
  const guestToken = searchParams.get('guest');
  
  // 1. Ambil nama dari parameter ?to= (Jika link dibuka dari tombol "Buka")
  let namaDariUrl = searchParams.get('to');

  let tamuId = '';
  let tamuNama = 'Tamu Spesial';

  // 2. Dekode token Base64 (Jika link dibuka dari WA / Salin Link)
  if (guestToken) {
    try {
      const decodedText = atob(guestToken);
      const parts = decodedText.split('|');
      
      if (parts.length === 2) {
        tamuId = parts[0];
        tamuNama = parts[1]; // Nama hasil dekode dari token Base64
      }
    } catch (error) {
      console.error("Token undangan tidak valid");
    }
  }

  // 3. LOGIKA FINAL PENENTUAN NAMA TAMU:
  // Jika namaDariUrl ada, gunakan itu. Jika tidak, gunakan tamuNama dari token.
  // Jika keduanya kosong, defaultnya "Tamu Spesial"
  const namaTamuFinal = namaDariUrl || tamuNama; 
  
  // Nanti di QR Code, gunakan tamuNama (karena itu spesifik dari database)

  // DATA QR CODE YANG SUDAH AMAN & SIAP SCAN
  const qrValue = JSON.stringify({
    id: tamuId, 
    slug: slug,
    nama: tamuNama,
    kategori: "VIP Access" 
  });

  // --- 2. MODIFIKASI USE EFFECT (LOGIKA PENYEGATAN) ---
  useEffect(() => {
    if (slug === 'demo') {
        console.log("Mode Preview: Menggunakan Data Dummy");
        setData(DATA_CONTOH);
        setLoading(false);
        return;
    }

    const fetchUndangan = async () => {
      try {
        if(!data) setLoading(true);
        const response = await axiosClient.get(`/invitation/${slug}`);
        setData(response.data);
        setLoading(false);
        
        console.log("DATA DARI BACKEND:", response.data); 
      } catch (err) { 
        console.error(err); 
        setLoading(false);
      }
    };
    fetchUndangan();
  }, [slug]);

  // VARIABEL SAKELAR DARI MYSQL
  // const setting = data?.setting || (slug === 'demo' ? DATA_CONTOH.setting : {});
  // const isPublikasi = setting.publikasi !== false; 
  // const isGunakanPin = setting.gunakan_pin === true;
  // const pinSandiAsli = setting.pin_sandi || "";
  
  // Variabel untuk menampilkan/menyembunyikan section
  // const showLoveStory = setting.tampil_cerita !== false;
  // const showStreaming = setting.tampil_streaming === true; 
  // const showGift = setting.tampil_kado !== false;
  // const showGuestbook = setting.tampil_bukutamu !== false;
  // const autoPlayMusik = setting.putar_musik !== false;
  // VARIABEL SAKELAR DARI MYSQL
  let settingData = data?.setting || (slug === 'demo' ? DATA_CONTOH.setting : {});
  
  // Jaga-jaga kalau MySQL membungkusnya dalam Array
  if (Array.isArray(settingData)) {
      settingData = settingData[0] || {}; 
  }

  // FUNGSI PENDETEKSI ANTI-BADAI
  // Hanya akan bernilai true jika datanya benar-benar angka 1, teks "1", atau boolean true
  const isAktif = (nilai, defaultNilai = true) => {
      if (nilai === undefined || nilai === null) return defaultNilai;
      return nilai == true || nilai == 1 || nilai == "1" || String(nilai).toLowerCase() === "true";
  };

  // TERAPKAN KE SEMUA SAKELAR
  const isPublikasi   = isAktif(settingData.publikasi, true); 
  const showLoveStory = isAktif(settingData.tampil_cerita, true);
  const showGift      = isAktif(settingData.tampil_kado, true);
  const showGuestbook = isAktif(settingData.tampil_bukutamu, true);
  const autoPlayMusik = isAktif(settingData.putar_musik, true);

  // Khusus streaming, defaultnya adalah false (tidak tampil)
  const showStreaming = isAktif(settingData.tampil_streaming, false);
  
  const bukaUndangan = () => {
    setIsOpened(true);
    // Musik hanya auto-play jika sakelar di dashboard ON
    if (autoPlayMusik && audioRef.current) {
        setIsPlaying(true);
        audioRef.current.play().catch(error => console.log("Audio autoplay blocked:", error));
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // --- LOGIKA DATA MEMPELAI (FIXED) ---
  let mempelaiData = {};
  if (data) {
      let raw = data.mempelai || data.Mempelai; 
      if (Array.isArray(raw)) {
          mempelaiData = raw[0] || {};
      } else {
          mempelaiData = raw || {};
      }
  }
  // ------------------------------------

  // TAMPILAN LOADING
  if (loading) return (
    <div className="h-screen flex items-center justify-center text-[#D85D5D] font-serif animate-pulse flex-col gap-2 bg-[#FFF5F7]">
        <span className="text-3xl">💌</span><span>Loading Invitation...</span>
    </div>
  );
  
  // TAMPILAN ERROR / KOSONG
  if (!data) return null;

  // ==========================================
  // RENDER BLOKIR PUBLIKASI (Jika tombol Publikasi OFF)
  // ==========================================
  if (!isPublikasi && slug !== 'demo') {
    return (
      <div className="h-screen flex items-center justify-center text-center bg-[#FFF5F7] p-6 flex-col">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-xl font-bold text-[#D85D5D] font-serif mb-2">Undangan Belum Tersedia</h1>
        <p className="text-gray-500 text-sm">Maaf, undangan ini sedang tidak dipublikasikan oleh pemilik acara.</p>
      </div>
    );
  }

  // ==========================================
  // RENDER GEMBOK PIN (Jika tombol PIN ON)
  // ==========================================
  // if (isGunakanPin && !pinTerbuka && slug !== 'demo') {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-[#FFF5F7] p-6 flex-col">
  //       <div className="bg-white p-8 rounded-[40px] shadow-xl border border-pink-200 max-w-sm w-full text-center">
  //           <div className="text-4xl mb-4">🔒</div>
  //           <h2 className="text-2xl font-bold text-[#D85D5D] font-serif mb-2">Undangan Privat</h2>
  //           <p className="text-xs text-gray-500 mb-6 font-sans">Silakan masukkan PIN keamanan untuk mengakses undangan ini.</p>
            
  //           <input 
  //             type="password" 
  //             placeholder="Masukkan PIN" 
  //             value={inputPin}
  //             onChange={(e) => {
  //                 setInputPin(e.target.value);
  //                 setErrorPin(false);
  //             }}
  //             className="w-full border border-pink-200 rounded-xl px-4 py-3 text-center tracking-[0.5em] focus:outline-none focus:border-[#D85D5D] mb-4 font-sans"
  //           />
  //           {errorPin && <p className="text-red-500 text-xs mb-4 font-sans">PIN yang Anda masukkan salah.</p>}

  //           <button 
  //              onClick={() => {
  //                  if (inputPin === pinSandiAsli) setPinTerbuka(true);
  //                  else setErrorPin(true);
  //              }}
  //              className="bg-[#D85D5D] text-white w-full py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#c04d4d] transition-colors"
  //           >
  //              Buka Undangan
  //           </button>
  //       </div>
  //     </div>
  //   );
  // }

  // ============================================================
  // RENDER UTAMA UNDANGAN (SAMA PERSIS DENGAN KODEMU)
  // ============================================================
  return (
    <div className="undangan-wrapper font-sans bg-[#FFF5F7] min-h-screen">
      
<Helmet>
        {/* Standar Browser (Tab HTML) */}
        <title>{settingData.share_judul || `Undangan Pernikahan ${mempelaiData.pria_panggilan} & ${mempelaiData.wanita_panggilan}`}</title>
        <meta name="description" content={settingData.share_deskripsi || "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami."} />

        {/* Open Graph (Facebook, Line, Telegram, WA, dll) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={settingData.share_judul || `Undangan Pernikahan ${mempelaiData.pria_panggilan} & ${mempelaiData.wanita_panggilan}`} />
        <meta property="og:description" content={settingData.share_deskripsi || "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami."} />
        {settingData.share_gambar && <meta property="og:image" content={imgUrl(settingData.share_gambar)} />}

        {/* Twitter / X Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={settingData.share_judul || `Undangan Pernikahan ${mempelaiData.pria_panggilan} & ${mempelaiData.wanita_panggilan}`} />
        <meta name="twitter:description" content={settingData.share_deskripsi || "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami."} />
        {settingData.share_gambar && <meta name="twitter:image" content={imgUrl(settingData.share_gambar)} />}
      </Helmet>

      {/* Audio Element */}
      {data.audio && <audio ref={audioRef} src={`/assets/audio/${data.audio}`} loop />}

      {/* ============================================================
          LAYER 1: OPENING MODAL (COVER DEPAN)
          ============================================================ */}
      <div className={`fixed inset-0 z-[60] flex items-center justify-center transition-transform duration-1000 ease-in-out ${isOpened ? '-translate-y-full' : 'translate-y-0'} bg-[#FFF5F7]`}>
         
         <div className="relative w-[85%] max-w-[360px] h-[500px] bg-[#faf9f6] rounded-[100px] border-[4px] border-[#F4C2C2] shadow-2xl flex flex-col justify-center items-center p-6 text-center">
            
            <p className="text-gray-500 text-[10px] tracking-[0.3em] font-serif uppercase mb-6">The Wedding Of</p>
            
            {/* NAMA PENGANTIN YANG SUDAH DIPERBAIKI */}
            <div className="flex flex-col items-center leading-tight space-y-2 mb-10">
                <h1 className="font-great-vibes text-5xl text-[#D85D5D]" style={{fontFamily: "'Great Vibes', cursive"}}>
                    {mempelaiData.pria_panggilan || "Pria"}
                </h1>
                
                <span className="font-great-vibes text-2xl text-[#D85D5D] opacity-60" style={{fontFamily: "'Great Vibes', cursive"}}>&</span>
                
                <h1 className="font-great-vibes text-5xl text-[#D85D5D]" style={{fontFamily: "'Great Vibes', cursive"}}>
                    {mempelaiData.wanita_panggilan || "Wanita"}
                </h1>
            </div>
            
            <div className="w-full bg-white border border-[#F4C2C2] py-4 px-4 rounded-3xl shadow-sm mb-8">
                <p className="text-gray-400 text-[10px] mb-1 italic">Kepada Yth Bapak/Ibu/Saudara/i:</p>
                <h3 className="text-lg font-bold text-gray-700 capitalize font-serif">{namaTamuFinal}</h3>
            </div>

            <button onClick={bukaUndangan} className="bg-[#D85D5D] text-white px-8 py-3 rounded-full text-xs shadow-lg hover:scale-105 transition-transform font-bold font-serif hover:bg-[#c04d4d]">
                ✉️ Open Invitation
            </button>
         </div>

      </div>

      {/* ============================================================
          LAYER 2: ISI UNDANGAN (UTAMA)
          ============================================================ */}
      <div className="relative z-10"> 
          
          {/* NAVBAR FLOATING */}
          {isOpened && (
             <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-pink-100 flex gap-6 text-xs font-serif text-[#D85D5D]">
                 <a href="#hero" className="hover:font-bold">Home</a>
                 <a href="#couple" className="hover:font-bold">Couple</a>
                 <a href="#acara" className="hover:font-bold">Event</a>
             </div>
          )}

          {/* FLOATING MENU KANAN */}
          <div className={`fixed top-1/2 -translate-y-1/2 right-4 z-40 flex flex-col gap-3 transition-all duration-700 ${isOpened ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
             <button onClick={toggleMusic} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md text-sm border border-pink-200 text-[#D85D5D]">
                <div className={isPlaying ? "animate-spin" : ""}>💿</div>
             </button>

             <button 
                onClick={() => setShowQrModal(true)} 
                className="w-10 h-10 bg-[#D85D5D] text-white rounded-full flex items-center justify-center shadow-lg text-lg border border-pink-200 hover:scale-110 transition-transform"
                title="Lihat Kode Masuk"
             >
                🎫
             </button>
          </div>

          {/* MODAL QR CODE (Efek tiket berlubangnya kembali!) */}
          {showQrModal && (
            <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-[#faf9f6] w-[300px] rounded-[40px] border-[4px] border-[#D85D5D]/30 p-8 flex flex-col items-center relative shadow-2xl animate-scale-up">
                    <button 
                        onClick={() => setShowQrModal(false)}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center font-bold text-sm hover:bg-red-200"
                    >
                        ✕
                    </button>

                    <h3 className="font-great-vibes text-3xl text-[#D85D5D] mb-1" style={{fontFamily: "'Great Vibes', cursive"}}>Wedding Pass</h3>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-6">Scan at Reception</p>

                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-inner mb-6">
                        <QRCode 
                            value={qrValue} 
                            size={140} 
                            fgColor="#333333"
                            bgColor="#FFFFFF"
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 mb-1">Nama Tamu</p>
                        <h4 className="text-lg font-bold text-[#D85D5D] font-serif capitalize">{tamuNama}</h4>
                        <div className="w-16 h-1 bg-[#F4C2C2] mx-auto my-2 rounded-full"></div>
                        <p className="text-[10px] text-gray-400">
                            {data?.acara?.resepsi_tanggal ? new Date(data.acara.resepsi_tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Save The Date"}
                        </p>
                    </div>

                    {/* Ini efek lubang tiket yang tadi terhapus! */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-black/60 rounded-full"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-black/60 rounded-full"></div>
                </div>
            </div>
          )}

          {/* SECTIONS YANG DIKONTROL SAKELAR */}
          <div id="hero"><HeroSection data={data} /></div>
          <div id="couple"><CoupleSection data={data} /></div>
          <div id="acara"><EventSection data={data} /></div>
          
          {showLoveStory && <div id="love-story"><LoveStorySection data={data} /></div>}
          {showGift && <div id="gift"><GiftSection data={data} /></div>}
          {showGuestbook && <div id="guestbook"><GuestbookSection data={data} /></div>}
          {showStreaming && <div id="streaming"><StreamingSection data={data} /></div>}
          
          <div id="closing"><ClosingSection data={data} /></div>

          <div className="h-24"></div>
      </div>

    </div>
  );
}