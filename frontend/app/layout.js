import Footer from "@/components/Home/Footer";
import GoogleAnalytics from "@/components/Home/GoogleAnalytics";
import Navbar from "@/components/Home/Navbar";
import AllProvider from "@/provider/AllProvider";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "GuaranteedSportPicks",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' data-theme='light'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased`}>
        <GoogleAnalytics />
        <AllProvider>
          <Navbar />
          {children}
          <Footer />
        </AllProvider>
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
