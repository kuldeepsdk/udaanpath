"use client";


import { Button } from "@/ui/components/tags/button";


const CTA = () => {
 return (
   <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
    
     {/* Background glowing blobs */}
     <div className="absolute inset-0 -z-10">
       <div className="absolute top-10 left-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full animate-float"></div>
       <div className="absolute bottom-10 right-20 w-96 h-96 bg-green-500/20 blur-[120px] rounded-full animate-float-delayed"></div>
     </div>


     <div className="max-w-4xl mx-auto">
       <div className="glass-card p-12 text-center rounded-3xl shadow-glow relative border-0 overflow-hidden">
        
         {/* Inner gradient effect */}
         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-400/10 animate-gradient opacity-50" />


         <div className="relative z-10 space-y-6">
           <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
             Ready to Start Your <span className="text-gradient">Journey?</span>
           </h2>


           <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
             Join lakhs of Indian youth using UdaanPath for Jobs, Sarkari Results,
             Mandi Bhav, Courses & Career Growth.
           </p>


           <div className="flex flex-wrap justify-center gap-4 pt-4">
             <Button
               size="lg"
               className="bg-blue-600 hover:bg-blue-700 text-white shadow-glow px-8 py-6 rounded-xl text-lg"
             >
               Get Started Free
             </Button>


             <Button
               size="lg"
               variant="outline"
               className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 px-8 py-6 rounded-xl text-lg"
             >
               Learn More
             </Button>
           </div>
         </div>
       </div>
     </div>
   </section>
 );
};


export default CTA;





