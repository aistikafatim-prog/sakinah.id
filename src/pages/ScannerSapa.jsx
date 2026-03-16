import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axiosClient from '../api/axiosClient';
import "../styles/ScannerSapa.css";

const ScannerSapa = () => {
  const { slug } = useParams();
  
  const [tamuHadir, setTamuHadir] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Data layar sapa
  const [dataSapa, setDataSapa] = useState({
    judul: "The Wedding...",
    subjudul: "Selamat Datang...",
    gambarLatar: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
  });

  // 2. Mengambil data dari Backend saat halaman dibuka
  useEffect(() => {
    const fetchDataSapa = async () => {
      try {
        const response = await axiosClient.get(`/invitation/${slug}/layar-sapa`);
        if (response.data) {
          setDataSapa(response.data);
        }
      } catch (error) {
        console.error("Gagal menarik pengaturan Layar Sapa:", error);
      }
    };

    fetchDataSapa();
  }, [slug]);

  // 👇 PERUBAHAN: Tambahkan useRef sebagai "Rem Tangan" kamera
  const scannerRef = useRef(null);

  useEffect(() => {
    // 👇 PERUBAHAN: Cegah React menyalakan kamera dua kali
    if (scannerRef.current) return;

    // Memulai mesin Scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    // Simpan data scanner ke dalam referensi
    scannerRef.current = scanner;

    const onScanSuccess = async (decodedText) => {
      try {
        const data = JSON.parse(decodedText);
        
        if (data && data.nama && data.id) {
          // 1. Pause kamera
          scanner.pause(true);
          
          // 2. Munculkan nama tamu
          setTamuHadir(data);
          setIsSuccess(true);
          
          // Suara BEEP
          const beep = new Audio('https://www.soundjay.com/buttons/sounds/beep-07a.mp3');
          beep.play().catch(e => console.log("Audio play di-block browser"));

          // TODO: Nanti kita tembak API Axios di sini

          // 3. Setelah 4 detik, nyalakan kamera lagi
          setTimeout(() => {
            setIsSuccess(false);
            setTamuHadir(null);
            scanner.resume();
          }, 4000);
        }
      } catch (e) {
        console.warn("QR Code tidak dikenali oleh sistem.");
      }
    };

    const onScanFailure = (error) => {
      // Abaikan error saat kamera mencari
    };

    scanner.render(onScanSuccess, onScanFailure);

    // 👇 PERUBAHAN: Cara mematikan scanner yang lebih aman
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Gagal mematikan scanner.", error));
        scannerRef.current = null;
        
        // Membersihkan elemen HTML yang tersisa
        const qrElement = document.getElementById("qr-reader");
        if (qrElement) qrElement.innerHTML = "";
      }
    };
  }, [slug]);

  return (
    <div className="fixed inset-0 w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans z-50">
      
      {/* Gambar Latar Belakang */}
      <img 
        src={dataSapa.gambarLatar} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* Konten Utama */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center">
        
        {/* Judul Acara di Atas */}
        <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-2 drop-shadow-xl" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {dataSapa.judul}
        </h1>
        <p className="text-lg md:text-2xl text-white/90 font-light drop-shadow-md mb-10">
          {dataSapa.subjudul}
        </p>

        {/* AREA KAMERA SCANNER ATAU SAPAAN */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border-2 border-white/30 p-6 rounded-3xl shadow-2xl relative min-h-[400px] flex items-center justify-center transition-all duration-500">
          
          {/* FASE 1: Kamera Menunggu */}
          <div className={`w-full transition-opacity duration-500 ${isSuccess ? 'opacity-0 absolute invisible' : 'opacity-100 relative'}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-inner p-2">
               <div id="qr-reader" className="w-full border-none"></div>
            </div>
            <p className="text-white/80 text-sm mt-4 animate-pulse drop-shadow-md">
              Arahkan Karcis QR Code ke Kamera
            </p>
          </div>

          {/* FASE 2 DENGAN GAYA FROSTED GLASS & EMAS */}
          <div className={`w-full text-center transition-opacity duration-500 transform ${isSuccess ? 'opacity-100 scale-100 relative' : 'opacity-0 scale-90 absolute invisible'}`}>
             <div className="text-6xl mb-4 drop-shadow-lg">✨</div>
             
             <p className="text-sm text-amber-200 uppercase tracking-widest font-bold mb-2 drop-shadow-md">
                Selamat Datang
             </p>
             
             <h2 className="text-3xl md:text-4xl font-bold text-white capitalize drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-3">
               {tamuHadir?.nama || "Tamu Undangan"}
             </h2>
             
             <span className="inline-block bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs px-4 py-1.5 rounded-full uppercase tracking-wider font-bold shadow-lg">
               {tamuHadir?.kategori}
             </span>
             
             <p className="text-white/80 text-xs mt-6 drop-shadow-md">
               Silakan masuk dan nikmati acara.
             </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs mt-12 tracking-widest uppercase">
          Powered by Sakinah.id
        </p>
      </div>

    </div>
  );
};

export default ScannerSapa;