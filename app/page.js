import GetFreeDailyPicks from "@/components/Home/GetFreeDailyPicks";
import HomeBanner from "@/components/Home/HomeBanner";
import LiveOddsPicks from "@/components/Home/LiveOddsPicks";
import Navbar from "@/components/Home/Navbar";
import Package from "@/components/Home/Package";
import TodaysFeature from "@/components/Home/TodaysFeature";
import WhyChoose from "@/components/Home/WhyChoose";

export default function Page() {
  return (
    <div>
      <Navbar />
      <HomeBanner />
      <TodaysFeature />
      <WhyChoose />
      <Package/>
      <LiveOddsPicks />
      <GetFreeDailyPicks />
    </div>
  );
}
