import HomeBanner from "@/components/Home/HomeBanner";
import LiveOddsPicks from "@/components/Home/LiveOddsPicks";
import Navbar from "@/components/Home/Navbar";

export default function Page() {
  return (
    <div>
     <Navbar></Navbar>
     <HomeBanner></HomeBanner>
     <LiveOddsPicks></LiveOddsPicks>
    </div>
  );
}