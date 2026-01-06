import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  // India
  { name: "Priya Sharma", country: "India", city: "Mumbai", rating: 5, text: "Absolutely stunning craftsmanship! The lehenga was beyond my expectations. Every detail was perfect for my wedding day." },
  { name: "Ananya Mehta", country: "India", city: "Delhi", rating: 5, text: "Sejal's vision for my reception gown was impeccable. The intricate embroidery work is simply breathtaking." },
  { name: "Kavita Patel", country: "India", city: "Ahmedabad", rating: 5, text: "Being a local, I've watched House of SERE grow. The quality and dedication remain unmatched in the city." },
  { name: "Ritu Agarwal", country: "India", city: "Jaipur", rating: 5, text: "The custom saree I ordered exceeded all expectations. The fabric quality and draping were perfect." },
  { name: "Sneha Reddy", country: "India", city: "Bangalore", rating: 5, text: "My bridal trousseau from House of SERE was the highlight of my wedding. Truly luxurious!" },
  { name: "Meera Iyer", country: "India", city: "Chennai", rating: 5, text: "Traveled from Chennai specifically for their collection. Worth every mile!" },
  { name: "Neha Kapoor", country: "India", city: "Pune", rating: 5, text: "The attention to detail in my engagement outfit was remarkable. Highly recommend!" },
  { name: "Divya Singh", country: "India", city: "Lucknow", rating: 5, text: "Classic Lucknowi taste with modern elegance. Sejal understood my vision perfectly." },
  // Dubai
  { name: "Fatima Al-Rashid", country: "UAE", city: "Dubai", rating: 5, text: "Found the perfect fusion outfit for my engagement. The quality rivals any Dubai boutique." },
  { name: "Aisha Khan", country: "UAE", city: "Dubai", rating: 5, text: "International shipping was seamless. The lehenga arrived in pristine condition." },
  { name: "Sara Ahmed", country: "UAE", city: "Abu Dhabi", rating: 5, text: "Exceptional craftsmanship and beautiful designs. My go-to for all occasions." },
  { name: "Huda Malik", country: "UAE", city: "Dubai", rating: 5, text: "The customization options are incredible. Got exactly what I envisioned." },
  { name: "Zara Hassan", country: "UAE", city: "Sharjah", rating: 5, text: "Premium quality at reasonable prices. House of SERE is a hidden gem." },
  { name: "Layla Qureshi", country: "UAE", city: "Dubai", rating: 5, text: "My wedding outfits from House of SERE made me feel like royalty. Stunning!" },
  { name: "Nadia Javed", country: "UAE", city: "Al Ain", rating: 5, text: "The designer understood exactly what I wanted. Perfect execution!" },
  { name: "Amira Sheikh", country: "UAE", city: "Dubai", rating: 5, text: "From consultation to delivery, the experience was absolutely wonderful." },
  // UK
  { name: "Anjali Patel", country: "UK", city: "London", rating: 5, text: "Flew in my entire wedding wardrobe from House of SERE. No regrets whatsoever!" },
  { name: "Priya Sharma", country: "UK", city: "Birmingham", rating: 5, text: "The virtual consultation was so helpful. Got my dream outfit delivered to the UK." },
  { name: "Neelam Desai", country: "UK", city: "Leicester", rating: 5, text: "Better quality than anything I've found in the UK. Absolutely gorgeous designs." },
  { name: "Sunita Rao", country: "UK", city: "Manchester", rating: 5, text: "My mother-in-law's outfit was the talk of the wedding. Thank you, House of SERE!" },
  { name: "Rekha Menon", country: "UK", city: "London", rating: 5, text: "Discovered them on Instagram. Now my entire family orders from them." },
  { name: "Pooja Verma", country: "UK", city: "Leeds", rating: 5, text: "The packaging was as luxurious as the outfit itself. Premium experience." },
  { name: "Deepika Nair", country: "UK", city: "Bristol", rating: 5, text: "Sejal's designs are truly one-of-a-kind. Worth the international shipping!" },
  { name: "Sonal Gupta", country: "UK", city: "Edinburgh", rating: 5, text: "Even with the distance, the communication and delivery were flawless." },
  // More International
  { name: "Ayesha Rahman", country: "India", city: "Kolkata", rating: 5, text: "The contemporary take on traditional Bengali wear is exquisite." },
  { name: "Shreya Joshi", country: "India", city: "Surat", rating: 5, text: "As someone in the textile business, I appreciate the superior fabric quality." },
  { name: "Maya Krishnan", country: "UAE", city: "Dubai", rating: 5, text: "Third outfit from House of SERE. They never disappoint!" },
  { name: "Tanya Malhotra", country: "UK", city: "Glasgow", rating: 5, text: "The custom couture service is outstanding. Every stitch is perfect." },
  { name: "Ishita Pandey", country: "India", city: "Hyderabad", rating: 5, text: "My sangeet outfit was the most beautiful I've ever worn. Magical!" },
  { name: "Radhika Shah", country: "UK", city: "Cambridge", rating: 5, text: "The blend of tradition and modernity is what sets House of SERE apart." },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section id="testimonials" className="section-padding bg-champagne/30" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Client Love
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            International Testimonials
          </h2>
          <div className="luxury-divider" />
          <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
            Trusted by clients across India, Dubai, UAE, and the United Kingdom
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${currentIndex}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="luxury-card p-6 bg-background"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-border pt-4">
                <p className="font-serif text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.city}, {testimonial.country}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <Button
            variant="luxuryOutline"
            size="icon"
            onClick={prevPage}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-primary w-6" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="luxuryOutline"
            size="icon"
            onClick={nextPage}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
