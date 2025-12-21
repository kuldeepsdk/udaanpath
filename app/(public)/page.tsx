import { SITE_CONFIG } from "@/config/site";
import Hero from "@/ui/components/sections/Hero";
import Stats from "@/ui/components/sections/Stats";
import Features from "@/ui/components/sections/Features";
import CTA from "@/ui/components/sections/CTA";


export default function HomePage(){
  return(
    <div>
      <Hero />
      <Stats />
      <Features />
    </div>
  );
}