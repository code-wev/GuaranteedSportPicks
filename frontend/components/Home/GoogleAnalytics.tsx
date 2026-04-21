"use client";

import Script from "next/script";

const GA_ID = "G-D44CQRPJ56";

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load gtag */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy='afterInteractive'
      />

      {/* Init script */}
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
