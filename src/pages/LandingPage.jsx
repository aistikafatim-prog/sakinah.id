import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Keunggulan from "../components/Keunggulan";
import Tema from "../components/Tema";
import Kado from "../components/Kado";
import CaraKerja from "../components/CaraKerja";
import FiturLengkap from "../components/FiturLengkap";
import Harga from "../components/Harga";
import Testimoni from "../components/Testimoni";
import MobileApp from "../components/MobileApp";
import Faq from "../components/Faq";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <Keunggulan />
      <Tema />
      <Kado />
      <CaraKerja />
      <FiturLengkap />
      <Harga />
      <Testimoni />
      <MobileApp />
      <Faq />
      <Footer />
    </div>
  );
}