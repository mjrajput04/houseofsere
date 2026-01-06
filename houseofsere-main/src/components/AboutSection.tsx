import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Gem, Palette, Heart, Award } from "lucide-react";
import storeInterior from "@/assets/store-interior.jpg";
const features = [{
  icon: Gem,
  title: "Premium Fabrics",
  description: "Handpicked silk, georgette, and velvet from the finest mills"
}, {
  icon: Palette,
  title: "Bespoke Design",
  description: "Custom creations tailored to your unique style and vision"
}, {
  icon: Heart,
  title: "Handcrafted Details",
  description: "Intricate embroidery and embellishments by master artisans"
}, {
  icon: Award,
  title: "International Quality",
  description: "Serving clients across Dubai, UAE, UK, and India"
}];
const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  return <section id="about" className="section-padding bg-champagne/30" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8
      }} className="text-center mb-16">
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Our Story
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            About the Designer
          </h2>
          <div className="luxury-divider" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {}} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="relative">
            <div className="relative">
              <div className="absolute -inset-4 border border-primary/20 rounded-sm" />
              <img alt="House of SERE Boutique" className="w-full h-auto rounded-sm shadow-luxury" src="/lovable-uploads/8dd18203-db1a-4cd0-88d6-d7eb78c9053c.jpg" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {}} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="space-y-6">
            <h3 className="font-serif text-2xl md:text-3xl text-foreground">Sejal Nazare</h3>
            <p className="text-primary text-sm tracking-widest uppercase">
              Founder & Creative Director
            </p>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                With a vision to blend timeless Indian heritage with contemporary 
                elegance, Sejal Nazre founded House of SERE to create pieces that 
                tell a story. Every creation is a testament to her passion for 
                intricate craftsmanship and attention to detail.
              </p>
              <p>
                From the bustling lanes of Ahmedabad to the glamorous streets of 
                Dubai and London, our creations have graced celebrations across 
                the globe. We believe every woman deserves to feel like royalty 
                on her special day.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="border-l-2 border-primary pl-6 py-2 my-8">
              <p className="font-serif text-lg italic text-foreground">
                "Fashion fades, but style is eternal. We create pieces that 
                become treasured heirlooms."
              </p>
              <cite className="text-sm text-muted-foreground mt-2 block">— Sejal Nazare</cite>
            </blockquote>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8,
        delay: 0.6
      }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => <motion.div key={feature.title} initial={{
          opacity: 0,
          y: 20
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.6,
          delay: 0.8 + index * 0.1
        }} className="luxury-card p-6 text-center">
              <feature.icon className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-serif text-lg text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default AboutSection;