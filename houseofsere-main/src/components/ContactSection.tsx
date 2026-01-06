import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock, Instagram, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=7096748749";
const INSTAGRAM_URL = "https://www.instagram.com/house_ofsere/";

const handleExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="section-padding bg-background" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Visit Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="text-foreground">Get in </span>
            <span className="gold-gradient">Touch</span>
          </h2>
          <div className="luxury-divider" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="luxury-card p-8">
              <h3 className="font-serif text-2xl text-foreground mb-6">
                Studio Location
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-foreground">House of SÉRE</p>
                    <p className="text-muted-foreground">
                      Mall, 100 Feet Anand Nagar Rd,<br />
                      Satellite, Ahmedabad,<br />
                      Gujarat 380015
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a
                      href="tel:+917096748749"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +91 7096748749
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Business Hours</p>
                    <p className="text-muted-foreground">
                      Mon - Sat: 11:00 AM - 8:00 PM<br />
                      Sunday: By Appointment Only
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => handleExternalLink(WHATSAPP_URL)}
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg rounded-md px-4 py-2 text-sm transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </button>
                <button
                  onClick={() => handleExternalLink(INSTAGRAM_URL)}
                  className="inline-flex items-center gap-2 border border-primary/50 bg-transparent text-primary hover:border-primary hover:bg-primary/5 rounded-sm px-4 py-2 text-sm transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </button>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="luxury-card overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0!2d72.5!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="House of SÉRE Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
