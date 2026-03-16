import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../styles/AkunSaya.css'; // <--- Import CSS Terpisah

export default function AkunSaya() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const dataString = localStorage.getItem('user_sakinah');
    if (dataString) setUser(JSON.parse(dataString));
  }, []);

  return (
    <div className="akun-page-container">
      <Sidebar />
      
      <main className="akun-content">
        <TopBar user={user} />

        <div className="akun-card">
          <h2 className="akun-title">Edit Profil</h2>
          
          <form>
            {/* Email (Read Only) */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="form-input-disabled" 
              />
              <p className="form-hint">*Email tidak dapat diubah</p>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password Baru</label>
              <input 
                type="password" 
                placeholder="Kosongkan jika tidak ingin mengubah" 
                className="form-input" 
              />
            </div>

            <button type="button" className="btn-save">
              Simpan Perubahan
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}