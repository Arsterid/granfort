import About from "@/components/sections/About";
import Advantages from "@/components/sections/Advantages";
import Contacts from "@/components/sections/Contacts";
import Custom from "@/components/sections/Custom";
import Hero from "@/components/sections/Hero";
import Products from "@/components/sections/Products";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Products />
      <Advantages />
      <Custom />
      <Contacts />
    </>
  );
}
