"use server";
import {serverFetch} from "@/lib/fetcher";

export async function getRotatingAds(){
    const ads = await serverFetch("/api/ads",{
        cache: "no-store",
         headers: {
            "x-internal-token": process.env.INTERNAL_API_TOKEN!,
        },
    });
    return ads;
}