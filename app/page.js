import HomeBanner from "@/components/HomeBanner";
import Navbar from "@/components/Navbar";
import TodaysFeature from "@/components/TodaysFeature";

export default function Page() {
  return (
    <div>
     <Navbar></Navbar>
     <HomeBanner></HomeBanner>
     <TodaysFeature/>
    </div>
  );
}