import React, { useRef, useEffect, useState } from 'react';
import '../styles/Testimoni.css';

export default function Testimoni() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false); // Untuk fitur Pause saat Hover

  // DATA ASLI
  const dataAsli = [
    {
      nama: "Eko Pujianto",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      text: "Oke, ini sudah bagus! Suka sama hasil akhirnya, benar-benar sesuai ekspektasi. Desainnya terlihat profesional."
    },
    {
      nama: "Dwiputra Malla",
      img: "../images/mempelai.jpg",
      text: "Keren banget, bossku! 🙏🙏 Benar-benar puas sama hasilnya. Desainnya luar biasa dan sesuai dengan harapan kami."
    },
    {
      nama: "Bima & Tri",
      img: "../images/weddingday.jpg",
      text: "Pelayanannya super ramah dan selalu siap membantu setiap kali aku butuh revisi. Pokoknya nggak ada kecewanya!"
    },
    {
      nama: "Sarah & Dimas",
      img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      text: "Suka banget sama fitur RSVP-nya, jadi gampang data tamu yang hadir. Thank you Sakinah.id!"
    }
  ];

  // TRIK INFINITY: Gabungkan data 2 kali (Data + Data)
  // Supaya saat scroll mentok kanan, kita bisa loncat ke kiri tanpa ketahuan
  const dataTesti = [...dataAsli, ...dataAsli];

  useEffect(() => {
    const el = scrollRef.current;
    let animationId;
    let speed = 0.8; // Kecepatan Scroll (Makin besar makin ngebut)

    const step = () => {
      // Jika user sedang hover (isPaused = true), jangan gerak
      if (!isPaused && el) {
        
        // Geser ke kanan sedikit demi sedikit
        el.scrollLeft += speed;

        // LOGIKA LOOPING (INFINITY)
        // Jika sudah scroll sampai setengah (habis data set pertama)
        // Langsung reset ke 0 (posisi awal) secara instan
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      // Ulangi terus menerus (seperti FPS game)
      animationId = requestAnimationFrame(step);
    };

    // Mulai animasi
    animationId = requestAnimationFrame(step);

    // Bersihkan animasi saat pindah halaman
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section id="testimoni" className="blok-testimoni">
      <div className="batas-testimoni">
        
        <div className="kepala-testimoni">
          <h2 className="judul-testimoni">Testimoni</h2>
        </div>

        {/* AREA SCROLL */}
        <div 
          ref={scrollRef} 
          className="wadah-scroll"
          // Event Handler: Saat mouse masuk -> Pause. Saat keluar -> Jalan lagi.
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {dataTesti.map((item, index) => (
            <div key={index} className="kartu-testi">
              <img src={item.img} alt={item.nama} className="img-bg-testi" />
              <div className="overlay-gelap"></div>
              <div className="kotak-review">
                <div>
                  <div className="text-sm text-blue-600 font-bold mb-1">dari <span className="underline">{item.nama}</span></div>
                </div>
                <div className="bintang">{'★'.repeat(5)}</div>
                <p className="teks-review">"{item.text}"</p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}