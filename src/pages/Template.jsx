import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import axiosClient from '../api/axiosClient';
import '../styles/Template.css';

export default function Template() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const dataString = localStorage.getItem('user_sakinah');
    if (!dataString) {
      navigate('/login');
    } else {
      setUser(JSON.parse(dataString));
      fetchTemplates();
    }
  }, [navigate]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/templates'); 
      if (res.data.status === 'success') {
        setTemplates(res.data.data);
      }
    } catch (error) {
      console.error("Gagal ambil template:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    const nilai = parseFloat(angka);
    if (nilai === 0) return "Gratis";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(nilai);
  };

  const handlePilihTemplate = async (item) => {
    const yakin = window.confirm(`Pilih desain "${item.nama_template}" seharga ${formatRupiah(item.harga)}?`);
    if (!yakin) return;

    setProcessing(true);
    try {
      // 1. PROSES PEMBAYARAN / BUAT TAGIHAN
      // (Asumsinya di sini anggap saja pembayarannya langsung sukses/lunas)
      const resBilling = await axiosClient.post('/billing/create', {
        nama_paket: item.nama_template,
        harga: item.harga
      });

      if (resBilling.data.status === 'success') {
        // 2. KARENA PEMBAYARAN SUDAH BERHASIL, BARU KITA BUATKAN SLOT KOSONGNYA
        // (Pastikan endpoint ini sesuai dengan route createEmptySlot di backend-mu)
        const resSlot = await axiosClient.post('/invitation/create-slot');
        
        // Ambil slug dari response backend
        const newSlug = resSlot.data.slug || resSlot.data.data.slug; 

        alert("✅ Pembayaran Berhasil! Mari mulai isi data undanganmu.");
        
        // 3. ARAHKAN LANGSUNG KE FORM EDIT BERDASARKAN SLUG BARU
        navigate(`/kelola-undangan/${newSlug}`); 
      }
    } catch (error) {
      console.error("Gagal order:", error);
      alert("Gagal memproses pesanan/pembayaran.");
    } finally {
      setProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="template-page-container">
      <Sidebar />

      <main className="template-main-wrapper">
        <div className="template-scroll-area">
          <TopBar user={user} />

          <div className="template-header">
            <h2 className="template-title">Pilih Template</h2>
            <button onClick={() => navigate(-1)} className="btn-back">
              <span>←</span> Kembali
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
                <p>Sedang memuat katalog...</p>
            </div>
          ) : (
            <div className="template-grid">
              {templates.map((item) => (
                <div key={item.id} className="template-card">
                  
                  <div className="template-img-wrapper">
                    <img 
                      src={
                        item.thumbnail_url 
                          ? `http://localhost:5000/uploads/${item.thumbnail_url}` 
                          : "/images/clasic.PNG"
                      } 
                      alt={item.nama_template} 
                      className="template-img"
                      onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}}
                    />
                  </div>

                  <div className="template-info">
                    <h3 className="template-name">{item.nama_template}</h3>
                    <p className="template-price">{formatRupiah(item.harga)}</p>
                    <span className="badge-type">
                        {item.tipe ? item.tipe.toUpperCase() : 'PREMIUM'}
                    </span>
                  </div>

                  <div className="template-actions">
                    <Link to="/wedding/demo" className="btn-preview">
                      Preview
                    </Link>
                    
                    <button 
                        onClick={() => handlePilihTemplate(item)}
                        disabled={processing}
                        className={`btn-select ${processing ? 'is-loading' : ''}`}
                    >
                      {processing ? "Memproses..." : "Pilih Template"}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}