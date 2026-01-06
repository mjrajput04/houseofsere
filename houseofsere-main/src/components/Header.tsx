import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Phone, User, ChevronDown, LogOut, UserCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [{
  name: "HOME",
  href: "#home"
}, {
  name: "ABOUT",
  href: "#about"
}, {
  name: "COLLECTIONS",
  href: "#collections"
}, {
  name: "TESTIMONIALS",
  href: "#testimonials"
}, {
  name: "CONTACT",
  href: "#contact"
}];

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=7096748749";
const INSTAGRAM_URL = "https://www.instagram.com/house_ofsere/";

const handleExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 lg:px-8">
        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex items-center justify-between h-20">
          <div className="flex-1">
            <a href="#home" className="inline-block">
              <img 
                src="/src/assets/serelogo.png" 
                alt="House of SÈRE" 
                className="h-12 w-auto drop-shadow-md"
              />
            </a>
          </div>
          <div className="flex items-center gap-12">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm tracking-[0.2em] text-white/90 hover:text-primary transition-colors duration-300 drop-shadow-md"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex-1 flex justify-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary shadow-luxury rounded-sm px-4 py-2 text-sm transition-all duration-300">
                    <User className="h-4 w-4" />
                    {user.firstName}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <UserCircle className="h-4 w-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-orders')} className="cursor-pointer">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary shadow-luxury rounded-sm px-4 py-2 text-sm transition-all duration-300"
              >
                <User className="h-4 w-4" />
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16">
          <a href="#home" className="inline-block">
            <img 
              src="/src/assets/serelogo.png" 
              alt="House of SÈRE" 
              className="h-10 w-auto drop-shadow-md"
            />
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 drop-shadow-md">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-black/90 backdrop-blur-sm rounded-lg mt-2"
            >
              <div className="py-6 space-y-4 px-4">
                {navLinks.map(link => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className="block text-sm tracking-widest text-white/90 hover:text-primary transition-colors duration-300 py-2"
                  >
                    {link.name}
                  </a>
                ))}
                {user ? (
                  <>
                    <div className="text-sm tracking-widest text-white/90 py-2">
                      Welcome, {user.firstName}
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsOpen(false);
                      }}
                      className="block text-sm tracking-widest text-white/90 hover:text-primary transition-colors duration-300 py-2 text-left"
                    >
                      MY PROFILE
                    </button>
                    <button
                      onClick={() => {
                        navigate('/my-orders');
                        setIsOpen(false);
                      }}
                      className="block text-sm tracking-widest text-white/90 hover:text-primary transition-colors duration-300 py-2 text-left"
                    >
                      MY ORDERS
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block text-sm tracking-widest text-white/90 hover:text-primary transition-colors duration-300 py-2 text-left"
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    className="block text-sm tracking-widest text-white/90 hover:text-primary transition-colors duration-300 py-2 text-left"
                  >
                    LOGIN
                  </button>
                )}
                <div className="pt-4 flex items-center gap-4">
                  <button 
                    onClick={() => {
                      handleExternalLink(INSTAGRAM_URL);
                      setIsOpen(false);
                    }} 
                    className="text-white/80 hover:text-primary transition-colors p-2" 
                    aria-label="Visit Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => {
                      handleExternalLink(WHATSAPP_URL);
                      setIsOpen(false);
                    }} 
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary shadow-luxury rounded-sm px-4 py-2 text-sm transition-all duration-300"
                  >
                    <Phone className="h-4 w-4" />
                    Inquire Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
