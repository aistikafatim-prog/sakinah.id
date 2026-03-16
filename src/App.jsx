import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman yang baru buat
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard';
import AkunSaya from './pages/AkunSaya';
import UndanganSaya from './pages/UndanganSaya';
import Template from './pages/Template';
import Tagihan from './pages/Tagihan';
import ManageInvitation from './pages/ManageInvitation';
import FormInvitation from './pages/FormInvitation';
import RsvpEditor from './pages/RsvpEditor';
import SettingEditor from './pages/SettingEditor';
import LayarsapaEditor from './pages/LayarsapaEditor';
import StreamingEditor from './pages/StreamingEditor';
import BukuTamuEditor from './pages/BukuTamuEditor';
import InvitationPreview from './pages/InvitationPreview';
import Undangan from './pages/Undangan';
import ScannerSapa from './pages/ScannerSapa';
import AdminPanel from './pages/AdminPanel';
export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* Rute Halaman Depan */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rute Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rute Register */}
        <Route path="/register" element={<Register />} />
        <Route path="/admin-panel" element={<AdminPanel />} />

        
        {/* Rute Dashboard (Nanti kita buat) */}
        {/* <Route path="/dashboard" element={<DashboardLayout />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/akun" element={<AkunSaya />} />
        {/* Tambahan Rute Sementara biar Sidebar gak error kalau diklik */}
        <Route path="/undangan-saya" element={<UndanganSaya/>} />
        <Route path="/template" element={< Template/>} />
        <Route path="/tagihan" element={<Tagihan />}/>
        <Route path="/kelola-undangan/:slug" element={< ManageInvitation/>} />
        <Route path="/editor/form/:slug" element={< FormInvitation/>}/>
        <Route path="/editor/bukutamu/:slug" element={< BukuTamuEditor/>}/>
        <Route path="/editor/rsvp/:slug" element={< RsvpEditor/>}/>
        <Route path="/editor/setting/:slug" element={< SettingEditor/>}/>
        <Route path="/editor/layar-sapa/:slug" element={<LayarsapaEditor/>}/>
        <Route path="/editor/streaming/:slug" element={<StreamingEditor/>}/>
        <Route path="/preview" element={<InvitationPreview />} />
        <Route path="/wedding/:slug" element={<Undangan />} />
        <Route path="/scanner/:slug" element={<ScannerSapa />} />
        

        

      </Routes>
    </Router>
  );
}