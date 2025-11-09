import Footer from "@/components/Home/Footer";
import GetFreeDailyPicks from "@/components/Home/GetFreeDailyPicks";
import HomeBanner from "@/components/Home/HomeBanner";
import LatestBettingInsights from "@/components/Home/LatestBettingInsights";
import LiveOddsPicks from "@/components/Home/LiveOddsPicks";
import Members from "@/components/Home/Members";
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
      <Members/>
      <LiveOddsPicks />
      <GetFreeDailyPicks/>
      <LatestBettingInsights/>
      <Footer/>
    </div>
  );
}
