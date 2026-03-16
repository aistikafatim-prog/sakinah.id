// import { useState } from 'react'; // Hapus 'React' biar tidak mati
// import '../styles/Tema.css';

// export default function Tema() {
//   const dataTema = [
//     {
//       nama: "Basic",
//       // Gambar placeholder hijau
//       img: "./images/basic.png"
//     },
//     {
//       nama: "Elegant",
//       // Gambar placeholder ungu
//       img: "./images/estetik.jpg"
//     }
//   ];

//   return (
//     <section id="tema" className="blok-tema">
//       <div className="batas-tema">
        
//         <div className="kepala-tema">
//           <h2 className="judul-tema">
//             Pilihan Tema Undangan yang <br/> Siap Dipakai
//           </h2>
//         </div>

//         <div className="grid-tema">
//           {dataTema.map((item, index) => (
//             <div key={index} className="kartu-tema">
              
//               {/* INI DIA HP REALISTISNYA */}
//               <div className="frame-hp">
//                 <img 
//                   src={item.img} 
//                   alt={item.nama} 
//                   className="layar-hp"
//                 />
//               </div>

//               {/* Info Bawah */}
//               <h3 className="nama-tema">{item.nama}</h3>
//               <button className="btn-preview">Preview</button>
            
//             </div>
//           ))}
//         </div>

//         <div className="area-tombol-bawah">
//           <button className="btn-lihat-semua">
//             Lihat Semua Tema
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>

//       </div>
//     </section>
//   );
// }
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient'; // Pastikan path ini benar mengarah ke konfigurasi axios-mu
import '../styles/Tema.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Tema() {
  const [dataTemplate, setDataTemplate] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Panggil supir navigasinya
  const navigate = useNavigate();

  // 2. FUNGSI PENYEDOT DATA DARI NODE.JS
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Ganti '/templates' dengan rute API GET yang kamu buat di backend
        const response = await axiosClient.get('/templates'); 
        
        // Menyesuaikan dengan standar JSON response (biasanya di response.data.data)
        const templates = response.data.data || response.data;
        setDataTemplate(templates);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data template:", error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // 3. FUNGSI LOGIKA KLIK TOMBOL LIHAT SEMUA
  const handleKlikLihatSemua = () => {
    const isLogin = localStorage.getItem('token'); 

    if (isLogin) {
      // Jika sudah login, antar ke halaman Dashboard Member
      navigate('/dashboard'); 
    } else {
      // Jika belum login, antar ke halaman Login
      navigate('/login'); 
    }
  };

  // 4. HELPER URL GAMBAR CERDAS
  const imgUrl = (filename) => {
    if (!filename) return "./images/basic.png"; // Gambar default jika kosong
    if (filename.startsWith('http')) return filename; // Jika URL sudah lengkap
    return `http://localhost:5000/uploads/${filename}`; // Jika hanya nama file dari Multer
  };

  // 5. HELPER FORMAT RUPIAH
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(angka);
  };

  return (
    <section id="tema" className="blok-tema">
      <div className="batas-tema">
        
        <div className="kepala-tema">
          <h2 className="judul-tema">
            Pilihan Template Undangan yang <br/> Siap Dipakai
          </h2>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center text-purple-900 font-bold animate-pulse text-xl">
            Memuat daftar template...
          </div>
        ) : (
          <div className="grid-tema">
            
            {/* 6. MAPPING DATA DARI DATABASE */}
            {dataTemplate.slice(0, 2).map((item) => (
              <div key={item.id} className="kartu-tema">
                
                {/* FRAME HP (TIDAK ADA CSS YANG DIUBAH) */}
                <div className="frame-hp">
                  <img 
                      // 1. Cek apakah ada nama file. Jika ada, gabungkan dengan URL backend.
                      // Jika kosong (null), pakai gambar bawaan lokal (clasic.PNG)
                      src={
                        item.thumbnail_url 
                          ? `http://localhost:5000/uploads/${item.thumbnail_url}` 
                          : "/images/clasic.PNG"
                      } 
                      alt={item.nama_template} 
                      className="layar-hp"
                      // 2. Jika gambar backend gagal dimuat, fallback ke gambar lokal saja agar tidak error
                      onError={(e) => {
                        e.target.onerror = null; // Mencegah looping error
                        e.target.src = '/images/clasic.PNG'; 
                      }}
                    />
                </div>

                {/* INFO TEMPLATE */}
                <h3 className="nama-tema">{item.nama_template}</h3> {/* Sesuai schema: nama_template */}
                
                {/* KOSMETIK TAMBAHAN (Opsional): 
                  Menampilkan harga atau status Gratis di atas tombol Preview.
                  Karena kamu memisahkan CSS, aku pakai Tailwind seperlunya saja khusus untuk teks kecil ini. 
                */}
                <p className="text-gray-500 font-medium mb-4">
                  {item.tipe === 'free' ? 'Gratis' : formatRupiah(item.harga)}
                </p>

                <Link to="/wedding/demo" className="btn-preview">
                  Preview
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="area-tombol-bawah">
          {/* PASANG FUNGSI ONCLICK DI SINI */}
          <button onClick={handleKlikLihatSemua} className="btn-lihat-semua">
            Lihat Semua Template
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}