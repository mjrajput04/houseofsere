import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import storeShowcase from "@/assets/store-showcase.png";
import heroVideo from "@/assets/hero-video.mp4";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=7096748749";

const handleExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const HeroSection = () => {
  const [videoSrc, setVideoSrc] = useState(heroVideo);
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    fetchHeroVideo();
  }, []);

  const fetchHeroVideo = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.heroVideo) {
          setVideoSrc(`/uploads/${settings.heroVideo}?t=${Date.now()}`);
          setVideoKey(prev => prev + 1);
        } else {
          setVideoSrc(heroVideo);
          setVideoKey(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch hero video:', error);
    }
  };
  return (
    <>
      {/* Video Hero Section */}
      <section className="relative w-full h-screen">
        <video
          key={videoKey}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background/90" />
        
        {/* Hero Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-4 drop-shadow-lg"
          >
            House of SÉRE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 tracking-[0.3em] uppercase mb-2 drop-shadow-md"
          >
            Timeless Indian Couture
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm md:text-base text-white/80 tracking-widest max-w-xl drop-shadow-md"
          >
            Where tradition meets contemporary elegance
          </motion.p>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Original Hero Content Section */}
      <section id="home" className="relative min-h-screen flex items-center py-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-champagne/50 to-background" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 text-primary mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm tracking-[0.3em] uppercase">DESIGNER SEJAL NAZARE</span>
                <Sparkles className="h-4 w-4" />
              </motion.div>

              {/* Brand Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-4"
              >
                <span className="gold-gradient">House of SÉRE</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight mb-6 text-foreground"
              >
                Timeless Indian Couture
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Exquisite handcrafted ethnic wear for the modern woman. 
                Where tradition meets contemporary elegance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={() => {
                    document.getElementById('collections')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-base tracking-widest uppercase hover:bg-primary/80 shadow-luxury rounded-sm transition-all duration-300"
                >
                  Explore Collections
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
                <button
                  onClick={() => handleExternalLink(WHATSAPP_URL)}
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary bg-transparent text-primary px-8 py-4 text-base tracking-widest uppercase hover:bg-primary hover:text-primary-foreground rounded-sm transition-all duration-300"
                >
                  Book Consultation
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-12 flex items-center justify-center lg:justify-start gap-8"
              >
                <div className="text-center">
                  <p className="font-serif text-2xl text-primary">500+</p>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">
                    Happy Clients
                  </p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="font-serif text-2xl text-primary">10+</p>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">
                    Countries
                  </p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="font-serif text-2xl text-primary">5★</p>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">
                    Reviews
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 border border-primary/20 rounded-sm" />
                <div className="absolute -inset-8 border border-primary/10 rounded-sm hidden lg:block" />
                
                <img
                  src={storeShowcase}
                  alt="House of SÉRE Designer Collection"
                  className="w-full h-auto rounded-sm shadow-luxury"
                />
                
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-background border border-primary/30 p-4 shadow-luxury rounded-sm"
                >
                  <p className="font-serif text-sm text-primary">Est. 2020</p>
                  <p className="text-xs text-muted-foreground">Ahmedabad</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
