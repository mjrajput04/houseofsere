import { Instagram, Phone, MapPin, Heart } from "lucide-react";
import logo from "@/assets/logo.svg";
const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=7096748749";
const INSTAGRAM_URL = "https://www.instagram.com/house_ofsere/";
const handleExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="relative overflow-hidden text-primary-foreground">
      {/* Beautiful Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" />
      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              
            </div>
            <p className="font-serif text-lg text-gold-light">House of SÉRE</p>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Timeless Indian couture for the modern woman. 
              Handcrafted with love in Ahmedabad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Collections", "Testimonials", "Contact"].map(link => <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-primary-foreground/70 hover:text-gold-light transition-colors text-sm">
                      {link}
                    </a>
                  </li>)}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-lg mb-4">Collections</h4>
            <ul className="space-y-2">
              {["Bridal Lehengas", "Designer Sarees", "Anarkali Gowns", "Custom Couture", "Indo-Western"].map(item => <li key={item}>
                    <button onClick={() => handleExternalLink(INSTAGRAM_URL)} className="text-primary-foreground/70 hover:text-gold-light transition-colors text-sm text-left">
                      {item}
                    </button>
                  </li>)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-gold-light flex-shrink-0" />
                <a href="tel:+917096748749" className="text-primary-foreground/70 hover:text-gold-light transition-colors text-sm">
                  +91 7096748749
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-gold-light flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">
                  Satellite, Ahmedabad, Gujarat
                </span>
              </li>
              <li className="flex gap-3">
                <Instagram className="h-5 w-5 text-gold-light flex-shrink-0" />
                <button onClick={() => handleExternalLink(INSTAGRAM_URL)} className="text-primary-foreground/70 hover:text-gold-light transition-colors text-sm">
                  @house_ofsere
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {currentYear} <span className="text-gold-light">House of SÉRE</span> — Designed by Sejal Nazre
            </p>
            <p className="text-primary-foreground/50 text-sm flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-accent fill-accent" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;