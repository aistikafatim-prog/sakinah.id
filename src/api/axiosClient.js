//Supaya kita tidak capek mengetik alamat http://localhost:5000 berulang-ulang di setiap halaman, kita buat satu file konfigurasi pusat.
import axios from 'axios';

// Kita buat satu 'jalur khusus' ke Backend
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Alamat Backend Sakinah
  headers: {
    'Content-Type': 'application/json', // Format bahasa pengantar: JSON
  },
});

// === INTERCEPTOR (PENCEGAT) ===
// Fungsinya: Setiap kali kita kirim request,
// otomatis tempelkan Token (kalau ada) ke saku satpam.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_sakinah'); // Ambil token dari brankas browser
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Tempelkan token
  }
  return config;
});

export default axiosClient;