"use client";

import { useEffect } from "react";

export default function AdSenseAuto() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block my-6"
      style={{ display: "block" }}
      data-ad-client="ca-pub-5566458360910453"
      data-ad-slot="5202104562"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
