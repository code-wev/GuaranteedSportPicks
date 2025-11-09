import GetFreeDailyPicks from "@/components/Home/GetFreeDailyPicks";
import HomeBanner from "@/components/Home/HomeBanner";
import LiveOddsPicks from "@/components/Home/LiveOddsPicks";
import Navbar from "@/components/Home/Navbar";
import TodaysFeature from "@/components/Home/TodaysFeature";

export default function Page() {
  return (
    <div>
      <Navbar />
      <HomeBanner />
      <TodaysFeature />
      <LiveOddsPicks />
      <GetFreeDailyPicks/>
    </div>
  );
}
