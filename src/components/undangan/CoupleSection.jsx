import React from 'react';
const imgUrl = (filename) => filename ? `http://localhost:5000/uploads/${filename}` : null;

export default function CoupleSection({ data }) {
  return (
    <section className="flex items-center justify-center h-auto py-12 px-4 bg-[#FFF5F7] relative z-10">
      
      {/* KARTU PANJANG (Long Pill Card) */}
      <div className="w-[85%] max-w-[360px] bg-[#faf9f6] rounded-[100px] border-[4px] border-[#D85D5D]/30 shadow-2xl flex flex-col items-center py-12 px-6 space-y-8 text-center">
          
          {/* --- MEMPELAI WANITA --- */}
          <div className="flex flex-col items-center space-y-2">
              <div className="w-32 h-32 rounded-full border-[4px] border-[#D85D5D] overflow-hidden shadow-md">
                  <img src={imgUrl(data.mempelai?.wanita_foto)} className="w-full h-full object-cover" alt="Bride" />
              </div>
              <div>
                  <h2 className="text-3xl font-script text-[#D85D5D]">{data.mempelai?.wanita_panggilan}</h2>
                  <p className="font-serif font-bold text-[#D85D5D] text-sm">{data.mempelai?.wanita_nama}</p>
                  <p className="text-[10px] text-gray-500 mt-1 px-2 leading-relaxed">
                      Putri dari <br/> 
                      Bapak {data.mempelai?.wanita_ortu}
                  </p>
              </div>
              <a href={`https://instagram.com/${data.mempelai?.wanita_ig}`} target="_blank" rel="noreferrer"
                 className="bg-[#D85D5D] text-white px-8 py-2.5 rounded-full 
           text-xs shadow-md hover:scale-105 transition-transform 
           tracking-wide font-serif hover:bg-[#c04d4d];
  ">
                 Instagram →
              </a>
          </div>

          {/* --- DAN (&) --- */}
          {/* <div className="text-2xl font-script text-[#D85D5D] opacity-50">&</div> */}

          {/* --- MEMPELAI PRIA --- */}
          <div className="flex flex-col items-center space-y-2">
              <div className="w-32 h-32 rounded-full border-[4px] border-[#D85D5D] overflow-hidden shadow-md">
                  <img src={imgUrl(data.mempelai?.pria_foto)} className="w-full h-full object-cover" alt="Groom" />
              </div>
              <div>
                  <h2 className="text-3xl font-script text-[#D85D5D]">{data.mempelai?.pria_panggilan}</h2>
                  <p className="font-serif font-bold text-[#D85D5D] text-sm">{data.mempelai?.pria_nama}</p>
                  <p className="text-[10px] text-gray-500 mt-1 px-2 leading-relaxed">
                      Putra dari <br/> 
                      Bapak {data.mempelai?.pria_ortu}
                  </p>
              </div>
              <a href={`https://instagram.com/${data.mempelai?.pria_ig}`} target="_blank" rel="noreferrer"
                 className="bg-[#D85D5D] text-white px-8 py-2.5 rounded-full 
           text-xs shadow-md hover:scale-105 transition-transform 
           tracking-wide font-serif hover:bg-[#c04d4d];
  ">
                 Instagram →
              </a>
          </div>

      </div>
    </section>
  );
}