import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../styles/FormInvitation.css';

// === 1. DEFINISI KOMPONEN INPUT HELPER ===
const Input = ({ val, onChange, ph, type = "text" }) => (
  <input 
    type={type}
    className="input-pill w-full" 
    value={val || ""} 
    onChange={onChange} 
    placeholder={ph} 
  />
);

const FormInvitation = () => {
  const navigate = useNavigate();
  const { slug } = useParams(); 
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // === 2. STATE DATA ===
  const [formData, setFormData] = useState({
    slug: "",
    theme: "basic",
    audio: "",
    paket: "Premium",
    pria: { nama: "", panggilan: "", ayah: "", ibu: "", ig: "" },
    wanita: { nama: "", panggilan: "", ayah: "", ibu: "", ig: "" },
    acara: { 
      akadTanggal: "", akadWaktu: "", resepsiTanggal: "", resepsiWaktu: "", 
      resepsiLokasi: "", provinsi: "", kecamatan: "", desa: "", link_streaming: "" 
    },
    gift: { bank: "", norek: "", an: "", alamat: "", penerima: "" },
    stories: []
  });

  const [files, setFiles] = useState({
    cover_foto: null, pria_foto: null, wanita_foto: null, story_fotos: {}
  });
  const [previews, setPreviews] = useState({
    cover_foto: null, pria_foto: null, wanita_foto: null, story_fotos: {}
  });

  // === 3. CEK MODE EDIT ===
  useEffect(() => {
    if (slug) {
      setIsEditMode(true);
      fetchDataUndangan(slug);
    }
  }, [slug]);

  const fetchDataUndangan = async (slugParam) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token_sakinah');
      const res = await axios.get(`http://localhost:5000/api/invitation/${slugParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = res.data;
      const baseUrl = "http://localhost:5000/uploads/";

      // Helper Pisah Nama Ortu
      const splitOrtu = (str) => {
        if(!str) return { ayah: "", ibu: "" };
        const clean = str.replace(/Bpk\. /g, "").replace(/Ibu /g, "");
        const parts = clean.split(" & ");
        return { ayah: parts[0] || "", ibu: parts[1] || "" };
      };

      const ortuPria = splitOrtu(data.mempelai?.pria_ortu);
      const ortuWanita = splitOrtu(data.mempelai?.wanita_ortu);

      setFormData({
        slug: data.slug,
        theme: data.theme || "basic",
        audio: data.audio || "",
        paket: data.theme === 'Basic' ? 'Dandelion' : 'Premium',
        pria: {
          nama: data.mempelai?.pria_nama, panggilan: data.mempelai?.pria_panggilan,
          ayah: ortuPria.ayah, ibu: ortuPria.ibu, ig: data.mempelai?.pria_ig
        },
        wanita: {
          nama: data.mempelai?.wanita_nama, panggilan: data.mempelai?.wanita_panggilan,
          ayah: ortuWanita.ayah, ibu: ortuWanita.ibu, ig: data.mempelai?.wanita_ig
        },
        acara: {
          akadTanggal: data.acara?.akad_tanggal, akadWaktu: data.acara?.akad_waktu,
          resepsiTanggal: data.acara?.resepsi_tanggal, resepsiWaktu: data.acara?.resepsi_waktu,
          resepsiLokasi: data.acara?.resepsi_lokasi, provinsi: data.acara?.provinsi,
          kecamatan: data.acara?.kecamatan, desa: data.acara?.desa,
          link_streaming: data.acara?.link_streaming
        },
        gift: {
          bank: data.gift?.bank_nama, norek: data.gift?.no_rekening,
          an: data.gift?.atas_nama, alamat: data.gift?.alamat_lengkap,
          penerima: data.gift?.penerima_paket
        },
        stories: data.stories || []
      });

      setPreviews({
        cover_foto: data.cover_foto ? baseUrl + data.cover_foto : null,
        pria_foto: data.mempelai?.pria_foto ? baseUrl + data.mempelai.pria_foto : null,
        wanita_foto: data.mempelai?.wanita_foto ? baseUrl + data.mempelai.wanita_foto : null,
        story_fotos: data.stories?.reduce((acc, s, i) => ({ ...acc, [i]: s.foto ? baseUrl + s.foto : null }), {})
      });

    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // === 4. HANDLERS ===
  const updateNested = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleFile = (e, fieldName, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (index === null) {
        setPreviews(prev => ({ ...prev, [fieldName]: url }));
        setFiles(prev => ({ ...prev, [fieldName]: file }));
      } else {
        setPreviews(prev => ({ ...prev, story_fotos: { ...prev.story_fotos, [index]: url } }));
        setFiles(prev => ({ ...prev, story_fotos: { ...prev.story_fotos, [index]: file } }));
      }
    }
  };

  const addStory = () => {
    setFormData(prev => ({
      ...prev, stories: [...prev.stories, { judul: "", tanggal: "", deskripsi: "" }]
    }));
  };

  const removeStory = (index) => {
    const newStories = formData.stories.filter((_, i) => i !== index);
    const newFiles = { ...files.story_fotos };
    const newPreviews = { ...previews.story_fotos };
    delete newFiles[index];
    delete newPreviews[index];

    setFormData(prev => ({ ...prev, stories: newStories }));
    setFiles(prev => ({ ...prev, story_fotos: newFiles }));
    setPreviews(prev => ({ ...prev, story_fotos: newPreviews }));
  };

  const updateStory = (index, field, value) => {
    const newStories = [...formData.stories];
    newStories[index][field] = value;
    setFormData(prev => ({ ...prev, stories: newStories }));
  };

  // === 5. FUNGSI SIMPAN (SINKRON DENGAN CONTROLLER) ===
  // const saveToDatabase = async () => {
  //   setLoading(true);
  //   try {
  //     const payload = new FormData();
  //     const token = localStorage.getItem('token_sakinah');

  //     if (isEditMode) {
  //       // --- JALUR UPDATE (FLAT FORMAT) ---
  //       payload.append('theme', formData.theme);
  //       payload.append('audio', formData.audio);
  //       if (files.cover_foto) payload.append('cover_foto', files.cover_foto);
  //       if (files.pria_foto) payload.append('pria_foto', files.pria_foto);
  //       if (files.wanita_foto) payload.append('wanita_foto', files.wanita_foto);

  //       payload.append('pria_nama', formData.pria.nama);
  //       payload.append('pria_panggilan', formData.pria.panggilan);
  //       payload.append('pria_ortu', `Bpk. ${formData.pria.ayah} & Ibu ${formData.pria.ibu}`);
  //       payload.append('pria_ig', formData.pria.ig);

  //       payload.append('wanita_nama', formData.wanita.nama);
  //       payload.append('wanita_panggilan', formData.wanita.panggilan);
  //       payload.append('wanita_ortu', `Bpk. ${formData.wanita.ayah} & Ibu ${formData.wanita.ibu}`);
  //       payload.append('wanita_ig', formData.wanita.ig);

  //       payload.append('akad_tanggal', formData.acara.akadTanggal);
  //       payload.append('akad_waktu', formData.acara.akadWaktu);
  //       payload.append('resepsi_tanggal', formData.acara.resepsiTanggal);
  //       payload.append('resepsi_waktu', formData.acara.resepsiWaktu);
  //       payload.append('resepsi_lokasi', formData.acara.resepsiLokasi);
  //       payload.append('provinsi', formData.acara.provinsi);
  //       payload.append('kecamatan', formData.acara.kecamatan);
  //       payload.append('desa', formData.acara.desa);
  //       payload.append('link_streaming', formData.acara.link_streaming);

  //       payload.append('gifts_json', JSON.stringify(formData.gift));
  //       payload.append('stories_json', JSON.stringify(formData.stories));

  //       formData.stories.forEach((_, i) => {
  //         if (files.story_fotos[i]) payload.append(`story_foto_${i}`, files.story_fotos[i]);
  //       });

  //       await axios.put(`http://localhost:5000/api/invitation/${slug}`, payload, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       alert("🎉 Perubahan berhasil disimpan!");
  //     } else {
  //       // --- JALUR CREATE (NESTED JSON) ---
  //       payload.append('slug', formData.slug || `undangan-${Date.now()}`);
  //       payload.append('theme', formData.theme);
  //       payload.append('audio', formData.audio);
  //       if (files.cover_foto) payload.append('cover_foto', files.cover_foto);
  //       if (files.pria_foto) payload.append('pria_foto', files.pria_foto);
  //       if (files.wanita_foto) payload.append('wanita_foto', files.wanita_foto);

  //       payload.append('pria', JSON.stringify({ ...formData.pria, ortu: `Bpk. ${formData.pria.ayah} & Ibu ${formData.pria.ibu}` }));
  //       payload.append('wanita', JSON.stringify({ ...formData.wanita, ortu: `Bpk. ${formData.wanita.ayah} & Ibu ${formData.wanita.ibu}` }));
  //       payload.append('acara', JSON.stringify(formData.acara));
  //       payload.append('gift', JSON.stringify(formData.gift));
  //       payload.append('stories_json', JSON.stringify(formData.stories));

  //       formData.stories.forEach((_, i) => {
  //         if (files.story_fotos[i]) payload.append('story_foto', files.story_fotos[i]);
  //       });

  //       await axios.post('http://localhost:5000/api/invitation/create', payload, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       alert("🎉 Undangan berhasil dibuat!");
  //     }
  //     navigate('/undangan-saya');
  //   } catch (error) {
  //     console.error(error);
  //     alert("Gagal menyimpan data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // === 5. FUNGSI SIMPAN (SINKRON DENGAN CONTROLLER) ===
  const saveToDatabase = async () => {
    setLoading(true);
    try {
      const payload = new FormData();
      const token = localStorage.getItem('token_sakinah');

      if (isEditMode) {
        // --- JALUR UPDATE (FLAT FORMAT) ---
        payload.append('theme', formData.theme);
        payload.append('audio', formData.audio);
        
        // 1. MASUKKAN TEKS DULU
        payload.append('pria_nama', formData.pria.nama);
        payload.append('pria_panggilan', formData.pria.panggilan);
        payload.append('pria_ortu', `Bpk. ${formData.pria.ayah} & Ibu ${formData.pria.ibu}`);
        payload.append('pria_ig', formData.pria.ig);

        payload.append('wanita_nama', formData.wanita.nama);
        payload.append('wanita_panggilan', formData.wanita.panggilan);
        payload.append('wanita_ortu', `Bpk. ${formData.wanita.ayah} & Ibu ${formData.wanita.ibu}`);
        payload.append('wanita_ig', formData.wanita.ig);

        payload.append('akad_tanggal', formData.acara.akadTanggal);
        payload.append('akad_waktu', formData.acara.akadWaktu);
        payload.append('resepsi_tanggal', formData.acara.resepsiTanggal);
        payload.append('resepsi_waktu', formData.acara.resepsiWaktu);
        payload.append('resepsi_lokasi', formData.acara.resepsiLokasi);
        payload.append('provinsi', formData.acara.provinsi);
        payload.append('kecamatan', formData.acara.kecamatan);
        payload.append('desa', formData.acara.desa);
        payload.append('link_streaming', formData.acara.link_streaming);

        payload.append('gifts_json', JSON.stringify(formData.gift));
        payload.append('stories_json', JSON.stringify(formData.stories));

        // 2. MASUKKAN FILE FOTO DI PALING BAWAH
        if (files.cover_foto) payload.append('cover_foto', files.cover_foto);
        if (files.pria_foto) payload.append('pria_foto', files.pria_foto);
        if (files.wanita_foto) payload.append('wanita_foto', files.wanita_foto);
        formData.stories.forEach((_, i) => {
          if (files.story_fotos[i]) payload.append(`story_foto_${i}`, files.story_fotos[i]);
        });

        await axios.put(`http://localhost:5000/api/invitation/${slug}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("🎉 Perubahan berhasil disimpan!");
      } else {
        // --- JALUR CREATE (NESTED JSON) ---
        // 1. MASUKKAN TEKS DULU
        payload.append('slug', formData.slug || `undangan-${Date.now()}`);
        payload.append('theme', formData.theme);
        payload.append('audio', formData.audio);
        payload.append('pria', JSON.stringify({ ...formData.pria, ortu: `Bpk. ${formData.pria.ayah} & Ibu ${formData.pria.ibu}` }));
        payload.append('wanita', JSON.stringify({ ...formData.wanita, ortu: `Bpk. ${formData.wanita.ayah} & Ibu ${formData.wanita.ibu}` }));
        payload.append('acara', JSON.stringify(formData.acara));
        payload.append('gift', JSON.stringify(formData.gift));
        payload.append('stories_json', JSON.stringify(formData.stories));

        // 2. MASUKKAN FILE FOTO DI PALING BAWAH
        if (files.cover_foto) payload.append('cover_foto', files.cover_foto);
        if (files.pria_foto) payload.append('pria_foto', files.pria_foto);
        if (files.wanita_foto) payload.append('wanita_foto', files.wanita_foto);
        formData.stories.forEach((_, i) => {
          if (files.story_fotos[i]) payload.append('story_foto', files.story_fotos[i]);
        });

        const API = import.meta.env.VITE_API_URL;

await axios.post(`${API}/api/invitation/create`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
        alert("🎉 Undangan berhasil dibuat!");
      }
      navigate('/undangan-saya');
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.slug) {
    return <div className="p-20 text-center font-bold">Memuat Data Undangan...</div>;
  }

  return (
    <div className="form-page-container">
      <div className="form-top-bar">
        <h1 className="form-page-title">{isEditMode ? "Edit Undangan" : "Buat Undangan Baru"}</h1>
        <Link to="/undangan-saya">
          <button className="btn-back">← Kembali</button>
        </Link>
      </div>

      <div className="layout-grid">
        {/* KOLOM 1: SETTING & GIFT */}
        <div className="col-stack">
          <div className="card-box">
            <h3 className="card-title">Template & Cover</h3>
            <div className="inner-card mb-4">
               <div className="icon-box">🌸</div>
               <div>
                 <p className="font-bold text-[#581c4f] text-sm">{formData.theme}</p>
                 <p className="text-gray-500 text-xs">Aktif</p>
               </div>
            </div>
            <label className="upload-box h-32">
               {previews.cover_foto && <img src={previews.cover_foto} className="preview-img" alt="cover" />} 
               <div className="upload-icon">📷</div>
               <span className="upload-btn-label">Upload Cover</span>
               <input type="file" hidden onChange={(e) => handleFile(e, 'cover_foto')} />
            </label>
            {/* Musik */}
          <div className="card-box mt-4">
            <h3 className="card-title">Musik</h3>
            <select 
              className="input-pill cursor-pointer w-full"
              value={formData.audio}
              onChange={(e) => setFormData(prev => ({ ...prev, audio: e.target.value }))}
            >
              <option value="">🎵 Pilih Musik</option>
              <option value="Beautiful In White">Beautiful In White</option>
              <option value="A Thousand Years">A Thousand Years</option>
              <option value="Perfect">Perfect</option>
              {/* Tambahkan daftar lagu lainnya di sini */}
            </select>
          </div>
          </div>

          <div className="card-box flex-grow">
             <h3 className="card-title">Gift / Amplop</h3>
             <div className="mb-2">
               <div className="section-badge">Cashless</div>
               <div className="input-wrapper">
                 <Input ph="Nama Bank" val={formData.gift.bank} onChange={e => updateNested("gift", "bank", e.target.value)} />
                 <Input ph="No. Rekening" val={formData.gift.norek} onChange={e => updateNested("gift", "norek", e.target.value)} />
                 <Input ph="Atas Nama" val={formData.gift.an} onChange={e => updateNested("gift", "an", e.target.value)} />
               </div>
             </div>
             <div>
               <div className="section-badge">Kirim Kado</div>
               <div className="input-wrapper">
                <textarea className="input-area h-20" placeholder="Alamat Kirim Kado..." 
                    value={formData.gift.alamat} onChange={e => updateNested("gift", "alamat", e.target.value)} />
                <Input ph="Nama Penerima" val={formData.gift.penerima} onChange={e => updateNested("gift", "penerima", e.target.value)} />
               </div>
             </div>
          </div>
        </div>

        {/* KOLOM 2: INFO ACARA */}
        <div className="card-box h-full">
          <h3 className="card-title text-center">Informasi Pernikahan</h3>
          <div className="info-stack">
            <div className="info-group">
               <h4 className="info-title">Waktu & Tanggal</h4>
               <div className="col-stack">
                  <div className="inner-card-col">
                    <p className="sub-header">✨ Akad Nikah</p>
                    <div className="input-row">
                      <input type="date" className="input-pill" 
                         value={formData.acara.akadTanggal} onChange={e => updateNested("acara", "akadTanggal", e.target.value)} />
                      <input type="time" className="input-pill" 
                         value={formData.acara.akadWaktu} onChange={e => updateNested("acara", "akadWaktu", e.target.value)} />
                    </div>
                  </div>
                  <div className="inner-card-col">
                    <p className="sub-header">🎉 Resepsi</p>
                    <div className="input-row">
                       <input type="date" className="input-pill" 
                          value={formData.acara.resepsiTanggal} onChange={e => updateNested("acara", "resepsiTanggal", e.target.value)} />
                       <input type="time" className="input-pill" 
                          value={formData.acara.resepsiWaktu} onChange={e => updateNested("acara", "resepsiWaktu", e.target.value)} />
                    </div>
                  </div>
               </div>
            </div>

            <div className="info-group">
               <h4 className="info-title">Lokasi Acara</h4>
               <div className="col-stack gap-3">
                  <div className="input-row">
                     <Input ph="Provinsi" val={formData.acara.provinsi} onChange={e => updateNested("acara", "provinsi", e.target.value)} />
                     <Input ph="Kecamatan" val={formData.acara.kecamatan} onChange={e => updateNested("acara", "kecamatan", e.target.value)} />
                  </div>
                  <Input ph="Desa / Kelurahan" val={formData.acara.desa} onChange={e => updateNested("acara", "desa", e.target.value)} />
                  <div>
                    <p className="sub-header mb-1 text-gray-400">Alamat Lengkap</p>
                    <textarea className="input-area h-32" placeholder="Contoh: Gedung Graha Sabha..."
                       value={formData.acara.resepsiLokasi} onChange={e => updateNested("acara", "resepsiLokasi", e.target.value)} />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* KOLOM 3: STORY & MEMPELAI */}
        <div className="col-stack">
           <div className="card-box">
             <div className="flex justify-between items-center mb-2">
               <h3 className="card-title mb-0">Love Story</h3>
               <button onClick={addStory} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold hover:bg-purple-200 transition">
                 + Tambah
               </button>
             </div>
             {formData.stories.map((story, index) => (
               <div key={index} className="mb-6 border-b border-purple-100 pb-4 last:border-0 last:pb-0 relative">
                  <div className="flex justify-between items-center mb-2 px-1">
                     <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Story #{index + 1}</span>
                     <button onClick={() => removeStory(index)} className="text-red-400 text-xs hover:text-red-600 font-bold">Hapus ✕</button>
                  </div>
                  <label className="upload-box h-short mb-2">
                     {previews.story_fotos[index] && <img src={previews.story_fotos[index]} className="preview-img" alt="story" />}
                     <div className="upload-icon">💖</div>
                     <input type="file" hidden onChange={(e) => handleFile(e, 'story_foto', index)} />
                  </label>
                  <Input ph="Judul Cerita" val={story.judul} onChange={e => updateStory(index, "judul", e.target.value)} />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="col-span-1">
                        <input type="date" className="input-pill px-2 text-center text-xs" 
                          value={story.tanggal} onChange={e => updateStory(index, "tanggal", e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <input className="input-pill" placeholder="Deskripsi..." 
                          value={story.deskripsi} onChange={e => updateStory(index, "deskripsi", e.target.value)} />
                      </div>
                  </div>
               </div>
             ))}
           </div>

           <div className="card-box">
              <h3 className="card-title text-center">Pengantin Pria</h3>
              <label className="upload-box h-32 mb-1">
                 {previews.pria_foto && <img src={previews.pria_foto} className="preview-img" alt="pria" />}
                 <div className="upload-icon">🤵‍♂️</div>
                 <input type="file" hidden onChange={(e) => handleFile(e, 'pria_foto')} />
              </label>
              <div className="col-stack gap-2">
                 <div className="input-row">
                    <Input ph="Panggilan" val={formData.pria.panggilan} onChange={e => updateNested("pria", "panggilan", e.target.value)} />
                    <Input ph="Nama Lengkap" val={formData.pria.nama} onChange={e => updateNested("pria", "nama", e.target.value)} />
                 </div>
                 <div className="input-row">
                    <Input ph="Nama Ayah" val={formData.pria.ayah} onChange={e => updateNested("pria", "ayah", e.target.value)} />
                    <Input ph="Nama Ibu" val={formData.pria.ibu} onChange={e => updateNested("pria", "ibu", e.target.value)} />
                 </div>
                 <Input ph="Username Instagram" val={formData.pria.ig} onChange={e => updateNested("pria", "ig", e.target.value)} />
              </div>
           </div>

           <div className="card-box">
              <h3 className="card-title text-center">Pengantin Wanita</h3>
              <label className="upload-box h-32 mb-1">
                 {previews.wanita_foto && <img src={previews.wanita_foto} className="preview-img" alt="wanita" />}
                 <div className="upload-icon">👰‍♀️</div>
                 <input type="file" hidden onChange={(e) => handleFile(e, 'wanita_foto')} />
              </label>
              <div className="col-stack gap-2">
                 <div className="input-row">
                    <Input ph="Panggilan" val={formData.wanita.panggilan} onChange={e => updateNested("wanita", "panggilan", e.target.value)} />
                    <Input ph="Nama Lengkap" val={formData.wanita.nama} onChange={e => updateNested("wanita", "nama", e.target.value)} />
                 </div>
                 <div className="input-row">
                    <Input ph="Nama Ayah" val={formData.wanita.ayah} onChange={e => updateNested("wanita", "ayah", e.target.value)} />
                    <Input ph="Nama Ibu" val={formData.wanita.ibu} onChange={e => updateNested("wanita", "ibu", e.target.value)} />
                 </div>
                 <Input ph="Instagram" val={formData.wanita.ig} onChange={e => updateNested("wanita", "ig", e.target.value)} />
              </div>
           </div>
        </div>
      </div>

      <div className="floating-save">
        <button className="btn-save" onClick={saveToDatabase} disabled={loading}>
          {loading ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Buat Undangan")}
        </button>
      </div>
    </div>
  );
};

export default FormInvitation;
