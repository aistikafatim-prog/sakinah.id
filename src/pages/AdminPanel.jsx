// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosClient from '../api/axiosClient';
// import '../styles/AdminPanel.css'; // Mengimpor CSS yang berisi @apply Tailwind

// export default function AdminPanel() {
//   const navigate = useNavigate();
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 1. Fungsi Ambil Data (Tetap sama)
//   const fetchTemplates = async () => {
//     try {
//       const response = await axiosClient.get('/templates');
//       const data = response.data.data || response.data;
//       setTemplates(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Gagal mengambil data template:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   // 2. LOGIKA HAPUS TEMPLATE
//   const handleDelete = async (id, nama) => {
//     // Memberikan konfirmasi agar tidak tidak sengaja terhapus
//     const konfirmasi = window.confirm(`Apakah kamu yakin ingin menghapus template "${nama}"?`);
    
//     if (konfirmasi) {
//       try {
//         await axiosClient.delete(`/templates/${id}`);
//         alert("Template berhasil dihapus!");
//         // Refresh data setelah berhasil dihapus
//         fetchTemplates(); 
//       } catch (error) {
//         alert("Gagal menghapus template. Coba cek backend!");
//         console.error(error);
//       }
//     }
//   };

//   // 3. LOGIKA EDIT (Sementara kita arahkan dulu ke halaman Editor)
//   const handleEdit = (id) => {
//     // Nanti kita akan buat rute khusus: /admin-panel/edit/:id
//     // Untuk sekarang, kita tandai dulu fungsinya
//     alert(`Fitur Edit untuk ID ${id} sedang disiapkan!`);
//   };

//   // 4. Logout (Tetap sama)
//   const handleLogout = () => {
//     localStorage.removeItem('token_sakinah');
//     localStorage.removeItem('user_sakinah');
//     navigate('/login');
//   };

//   const formatRupiah = (angka) => {
//     return new Intl.NumberFormat('id-ID', { 
//       style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
//     }).format(angka);
//   };

//   return (
//     <div className="admin-container">
//       {/* ... bagian header ... */}

//       <div className="admin-card">
//         <div className="admin-action-bar">
//           <h2 className="admin-subjudul">Kelola Template Undangan</h2>
//           <button className="btn-tambah" onClick={() => alert("Form Tambah sedang dibuat!")}>
//             + Tambah Template Baru
//           </button>
//         </div>

//         {loading ? (
//           <div className="admin-loading">Memuat data template...</div>
//         ) : (
//           <div className="tabel-wrapper">
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   <th className="admin-th rounded-tl-lg">No</th>
//                   <th className="admin-th">Nama Template</th>
//                   <th className="admin-th">Tipe</th>
//                   <th className="admin-th">Harga</th>
//                   <th className="admin-th rounded-tr-lg">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {templates.length > 0 ? (
//                   templates.map((item, index) => (
//                     <tr key={item.id} className="admin-tr">
//                       <td className="admin-td">{index + 1}</td>
//                       <td className="admin-td font-bold text-gray-800">{item.nama_template}</td>
//                       <td className="admin-td">
//                         <span className={item.tipe === 'free' ? 'badge-free' : 'badge-premium'}>
//                           {item.tipe || 'PREMIUM'}
//                         </span>
//                       </td>
//                       <td className="admin-td teks-harga">
//                         {item.tipe === 'free' ? 'Gratis' : formatRupiah(item.harga)}
//                       </td>
//                       <td className="admin-td aksi-wrapper">
//                         {/* PASANG FUNGSI ONCLICK DI SINI */}
//                         <button 
//                           className="btn-edit" 
//                           onClick={() => handleEdit(item.id)}
//                         >
//                           Edit
//                         </button>
//                         <button 
//                           className="btn-hapus" 
//                           onClick={() => handleDelete(item.id, item.nama_template)}
//                         >
//                           Hapus
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="admin-empty">Belum ada template.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import '../styles/AdminPanel.css'; 

export default function AdminPanel() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // === STATE UNTUK MODAL & FORM ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 👇 STATE BARU: Untuk menyimpan ID template yang sedang diedit
  const [editId, setEditId] = useState(null); 
  
  // State untuk menyimpan ketikan user
  const [formData, setFormData] = useState({
    nama_template: '',
    harga: '',
    tipe: 'premium'
  });
  
  // State khusus untuk file gambar
  const [thumbnail, setThumbnail] = useState(null);

  // 1. Fungsi Ambil Data
  const fetchTemplates = async () => {
    try {
      const response = await axiosClient.get('/templates');
      const data = response.data.data || response.data;
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data template:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 2. Fungsi Hapus
  const handleDelete = async (id, nama) => {
    const konfirmasi = window.confirm(`Yakin ingin menghapus template "${nama}"?`);
    if (konfirmasi) {
      try {
        await axiosClient.delete(`/templates/${id}`);
        fetchTemplates(); 
      } catch (error) {
        alert("Gagal menghapus template.");
      }
    }
  };

  // 👇 3. Fungsi Buka Modal Tambah (Form Kosong)
  const handleKlikTambah = () => {
    setEditId(null); // Mode Tambah (Bukan Edit)
    setFormData({ nama_template: '', harga: '', tipe: 'premium' });
    setThumbnail(null);
    setIsModalOpen(true);
  };

  // 👇 4. Fungsi Buka Modal Edit (Form Terisi)
  const handleEdit = (id) => {
    const targetTemplate = templates.find(item => item.id === id);
    if (targetTemplate) {
      setEditId(id); // Menandakan kita masuk Mode Edit
      setFormData({
        nama_template: targetTemplate.nama_template || '',
        harga: targetTemplate.harga ? targetTemplate.harga.toString() : '0',
        tipe: targetTemplate.tipe || 'premium'
      });
      setThumbnail(targetTemplate.thumbnail_url || null); // File gambar dikosongkan (opsional diisi lagi)
      setIsModalOpen(true); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token_sakinah');
    localStorage.removeItem('user_sakinah');
    navigate('/login');
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  // === FUNGSI: HANDLE FORM & SUBMIT ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipe') {
      setFormData({ 
        ...formData, 
        tipe: value,
        harga: value === 'free' ? '0' : '' 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleHargaChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, harga: rawValue });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // 👇 5. Handle Submit (Bisa untuk Tambah dan Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataKirim = new FormData();
    dataKirim.append('nama_template', formData.nama_template);
    dataKirim.append('harga', formData.harga);
    dataKirim.append('tipe', formData.tipe);
    
    if (thumbnail) {
      dataKirim.append('thumbnail', thumbnail); 
    }

    try {
      if (editId) {
        // MODE EDIT: Tembak ke PUT /templates/:id
        await axiosClient.put(`/templates/${editId}`, dataKirim, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Template berhasil diperbarui! ✨");
      } else {
        // MODE TAMBAH: Tembak ke POST /templates
        await axiosClient.post('/templates', dataKirim, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Template baru berhasil ditambahkan! 🎉");
      }
      
      // Bersihkan form & tutup modal
      setFormData({ nama_template: '', harga: '', tipe: 'premium' });
      setThumbnail(null);
      setEditId(null);
      setIsModalOpen(false);
      fetchTemplates();

    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data. Cek koneksi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-judul">👑 Dashboard Super Admin</h1>
        <button onClick={handleLogout} className="btn-logout">Keluar</button>
      </div>

      <div className="admin-card">
        <div className="admin-action-bar">
          <h2 className="admin-subjudul">Kelola Template Undangan</h2>
          {/* 👇 Pakai fungsi handleKlikTambah */}
          <button className="btn-tambah" onClick={handleKlikTambah}>
            + Tambah Template Baru
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">Memuat data template...</div>
        ) : (
          <div className="tabel-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-th rounded-tl-lg">No</th>
                  <th className="admin-th">Nama Template</th>
                  <th className="admin-th">Tipe</th>
                  <th className="admin-th">Harga</th>
                  <th className="admin-th rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {templates.length > 0 ? (
                  templates.map((item, index) => (
                    <tr key={item.id} className="admin-tr">
                      <td className="admin-td">{index + 1}</td>
                      <td className="admin-td font-bold text-gray-800">{item.nama_template}</td>
                      <td className="admin-td">
                        <span className={item.tipe === 'free' ? 'badge-free' : 'badge-premium'}>
                          {item.tipe || 'PREMIUM'}
                        </span>
                      </td>
                      <td className="admin-td teks-harga">
                        {item.tipe === 'free' ? 'Gratis' : formatRupiah(item.harga)}
                      </td>
                      <td className="admin-td aksi-wrapper">
                        {/* 👇 Tombol Edit sekarang sudah memanggil fungsi */}
                        <button className="btn-edit" onClick={() => handleEdit(item.id)}>Edit</button>
                        <button className="btn-hapus" onClick={() => handleDelete(item.id, item.nama_template)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="admin-empty">Belum ada template.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            
            <div className="modal-header">
              {/* 👇 Judul Modal berubah dinamis */}
              <h3 className="modal-judul">{editId ? 'Edit Template' : 'Tambah Template Baru'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                
                <div className="form-group">
                  <label className="form-label">Nama Template</label>
                  <input 
                    type="text" 
                    name="nama_template"
                    className="form-input" 
                    placeholder="Contoh: Tema Rustic Gold" 
                    value={formData.nama_template}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipe Template</label>
                  <select 
                    name="tipe" 
                    className="form-input"
                    value={formData.tipe}
                    onChange={handleChange}
                  >
                    <option value="premium">Premium (Berbayar)</option>
                    <option value="free">Free (Gratis)</option>
                  </select>
                </div>

                {formData.tipe === 'premium' && (
                  <div className="form-group">
                    <label className="form-label">Harga (Rp)</label>
                    <input 
                      type="text" 
                      name="harga"
                      className="form-input" 
                      placeholder="Ketik angka, misal: 150000" 
                      value={formData.harga ? new Intl.NumberFormat('id-ID').format(formData.harga) : ''}
                      onChange={handleHargaChange}
                      required 
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Thumbnail HP (Gambar)</label>
                  {/* 👇 TAMBAHAN: Preview Gambar Lama Saat Mode Edit 👇 */}
                  {editId && typeof thumbnail === 'string' && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Gambar saat ini:</p>
                      <img 
                        // Sesuaikan URL ini dengan port backend Node.js milikmu (misal 5000)
                        src={`http://localhost:5000/uploads/${thumbnail}`} 
                        alt="Preview" 
                        className="h-32 object-contain border border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="form-input form-file" 
                    onChange={handleFileChange}
                    // 👇 Gambar hanya wajib jika mode Tambah. Kalau Edit, gambar opsional.
                    required={!editId} 
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {editId ? '*Biarkan kosong jika tidak ingin mengganti gambar' : '*Maksimal 5MB. Format: JPG, PNG, WEBP'}
                  </p>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn-batal" onClick={() => setIsModalOpen(false)}>Batal</button>
                {/* 👇 Teks Tombol berubah dinamis */}
                <button type="submit" className="btn-simpan" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : (editId ? 'Update Template' : 'Simpan Template')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}