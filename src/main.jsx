import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //React punya fitur keamanan yang dinamakan Strict Mode. Fitur ini sengaja menjalankan proses komponen dua kali berturut-turut dalam sepersekian detik untuk mengecek apakah ada error. Karena fitur kameranya dijalankan dua kali secara kilat, library tersebut jadi bingung dan 
  // mencetak elemen kamera dua lapis ke layar
  // <StrictMode>
    <App />
  // </StrictMode>,
)
