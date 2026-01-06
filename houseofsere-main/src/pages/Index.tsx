import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CollectionsSection from "@/components/CollectionsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>House of SERE | Luxury Indian Ethnic Wear by Designer Sejal Nazre</title>
        <meta
          name="description"
          content="Discover exquisite handcrafted bridal lehengas, designer sarees, and custom couture at House of SERE. Premium ethnic wear by Sejal Nazre in Ahmedabad, serving Dubai, UAE, UK & India."
        />
        <meta
          name="keywords"
          content="Indian ethnic wear, bridal lehenga, designer saree, Ahmedabad boutique, House of SERE, Sejal Nazre, luxury Indian fashion, custom couture"
        />
        <meta property="og:title" content="House of SERE | Luxury Indian Ethnic Wear" />
        <meta
          property="og:description"
          content="Timeless Indian couture for the modern woman. Handcrafted bridal wear, designer sarees & custom creations."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://houseofsere.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <CollectionsSection />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
