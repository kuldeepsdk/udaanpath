"use client";


import { useEffect, useState } from "react";


export function useCountUp(end: number, duration = 2000) {
 const [count, setCount] = useState(0);


 useEffect(() => {
   let start = 0;
   const incrementTime = 15; // smooth animation
   const totalSteps = duration / incrementTime;
   const increment = end / totalSteps;


   const timer = setInterval(() => {
     start += increment;
     if (start >= end) {
       start = end;
       clearInterval(timer);
     }
     setCount(Math.floor(start));
   }, incrementTime);


   return () => clearInterval(timer);
 }, [end, duration]);


 return count;
}





