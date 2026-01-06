import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MessageCircle, Instagram, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=7096748749";
const INSTAGRAM_URL = "https://www.instagram.com/house_ofsere/";

const getWhatsAppLink = (productTitle: string) => {
  const text = encodeURIComponent(`Hello, I'm interested in the ${productTitle}`);
  return `${WHATSAPP_URL}&text=${text}`;
};

const CollectionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleBuyClick = (product: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/buy/${product._id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="collections" className="section-padding bg-background" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Curated Excellence
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="text-foreground">Our </span>
            <span className="gold-gradient">Collections</span>
          </h2>
          <div className="luxury-divider" />
          <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
            Each piece in our collection is a masterpiece of traditional craftsmanship 
            and contemporary design, created to make you feel extraordinary.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.03 }}
              className="group relative overflow-hidden rounded-sm border border-border bg-card shadow-card hover:shadow-hover transition-all duration-500"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={product.imageUrl || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover hq-image transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              {/* Overlay - always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-sm tracking-wider uppercase">
                  {product.category}
                </span>
              </div>
              
              {/* Content - always visible on mobile, hover on desktop */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground transform translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-serif text-lg">{product.title}</h3>
                  <span className="text-sm font-medium bg-primary/20 px-2 py-1 rounded">Price: {product.price}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBuyClick(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-3 rounded-sm text-sm hover:bg-primary/80 transition-colors"
                    aria-label={`Buy ${product.title}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Buy
                  </button>
                  <a
                    href={getWhatsAppLink(product.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2 px-3 rounded-sm text-sm hover:bg-[#128C7E] transition-colors"
                    aria-label={`Inquire on WhatsApp about ${product.title}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Inquire
                  </a>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center bg-primary/20 text-primary-foreground py-2 px-3 rounded-sm hover:bg-primary/30 transition-colors"
                    aria-label="Open Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary shadow-luxury rounded-sm px-8 py-3 transition-all duration-300"
            aria-label="View more products on Instagram"
          >
            <Instagram className="h-5 w-5" />
            View More on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionsSection;
