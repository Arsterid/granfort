import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import About from "@/components/sections/About";
import Advantages from "@/components/sections/Advantages";
import Contacts from "@/components/sections/Contacts";
import Custom from "@/components/sections/Custom";
import Hero from "@/components/sections/Hero";
import Products from "@/components/sections/Products";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <About />
        <Products />
        <Advantages />
        <Custom />
        <Contacts />
      </main>

      <Footer />
    </>
  );
}
