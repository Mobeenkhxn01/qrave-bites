import HomePage from "@/components/layout/homepage/HomePage";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 w-full">
      <Navbar />
      <HomePage />
      <Footer />
    </main>
  );
}
