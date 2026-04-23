"use client";

import Script from "next/script";

const GA_ID = "G-YCV1G74BT3";

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy='afterInteractive'
      />

      {/* Initialize GA */}
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
