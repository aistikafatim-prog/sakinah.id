import { useState, useEffect } from 'react'; 
import axiosClient from '../api/axiosClient'; // 👈 1. Import alat penyedot data
import '../styles/Hero.css';

export default function Hero() {
    // 2. Ubah daftarGambar menjadi State agar bisa diisi data dari database
    const [daftarGambar, setDaftarGambar] = useState([]);
    const [indexAktif, setIndexAktif] = useState(0);

    // 3. Tarik data dari Backend saat halaman pertama kali dimuat
    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Gunakan endpoint public agar pengunjung tidak butuh login
                const response = await axiosClient.get('/templates/public'); 
                const data = response.data.data || response.data;

                // Ambil 3 template pertama yang punya gambar
                const gambarDariDatabase = data
                    .filter(item => item.thumbnail_url) // Pastikan ada gambarnya
                    .slice(0, 3) // Ambil maksimal 3 gambar untuk slider
                    .map(item => `http://localhost:5000/uploads/${item.thumbnail_url}`);

                // Jika database ada isinya, pakai itu. Jika kosong, pakai gambar default.
                if (gambarDariDatabase.length > 0) {
                    setDaftarGambar(gambarDariDatabase);
                } else {
                    setDaftarGambar(["/images/clasic.PNG"]);
                }
            } catch (error) {
                console.error("Gagal mengambil gambar Hero:", error);
                setDaftarGambar(["/images/clasic.PNG"]); // Fallback jika server mati
            }
        };

        fetchImages();
    }, []);

    // 4. Timer Otomatis (Ganti gambar tiap 3 detik)
    useEffect(() => {
        // Jangan jalankan slider kalau gambarnya cuma 1 atau 0
        if (daftarGambar.length <= 1) return;

        const timer = setInterval(() => {
            setIndexAktif((prevIndex) =>
                prevIndex === daftarGambar.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); 

        return () => clearInterval(timer); 
    }, [daftarGambar.length]); // Timer bergantung pada jumlah gambar

    return (
        <section id="beranda" className="hero-blok relative">
            <div className="hero-grid relative z-10">

                {/* BAGIAN KIRI (TEKS) - TIDAK BERUBAH */}
                <div className="area-teks">
                    <h1 className="judul-besar">
                        Undangan Digital Modern & Elegan
                    </h1>
                    <p className="teks-deskripsi">
                        Buat undangan pernikahan digital yang cantik, cepat, dan mudah diedit.
                        Lengkap dengan fitur RSVP, Galeri Foto, dan Musik.
                    </p>
                    <div className="grup-tombol">
                        <a href="#buat" className="btn-utama">Mulai Gratis Sekarang</a>
                        <a href="#tema" className="btn-outline">Lihat Tema</a>
                    </div>
                </div>

                {/* --- BAGIAN KANAN (SLIDER HP) --- */}
                <div className="area-gambar">
                    <div className="hiasan-belakang"></div>

                    <div className="hp-css relative overflow-hidden">
                        
                        {/* 5. Mapping gambar yang sudah ditarik dari database */}
                        {daftarGambar.map((imgUrl, i) => (
                            <img
                                key={i}
                                src={imgUrl}
                                alt={`Preview Tema ${i + 1}`}
                                className={`slide-gambar ${i === indexAktif ? 'aktif' : ''}`}
                                // Fallback keamanan jika gambar di backend terhapus
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/clasic.PNG';
                                }}
                            />
                        ))}

                    </div>
                </div>

            </div>
        </section>
    );
}