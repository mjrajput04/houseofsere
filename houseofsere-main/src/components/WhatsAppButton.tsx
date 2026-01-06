import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=7096748749";

const handleExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const WhatsAppButton = () => {
  return (
    <motion.button
      onClick={() => handleExternalLink(WHATSAPP_URL)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      
      {/* Pulse animation */}
      <motion.span
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#25D366]"
      />
    </motion.button>
  );
};

export default WhatsAppButton;
