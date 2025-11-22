import GetFreeDailyPicks from "@/components/Home/GetFreeDailyPicks";
import HomeBanner from "@/components/Home/HomeBanner";
import LatestBettingInsights from "@/components/Home/LatestBettingInsights";
import LiveOddsPicks from "@/components/Home/LiveOddsPicks";
import Members from "@/components/Home/Members";
import Package from "@/components/Home/Package";
import TodaysFeature from "@/components/Home/TodaysFeature";
import WhyChoose from "@/components/Home/WhyChoose";

export default function Page() {
  return (
    <div>
      <HomeBanner />
      <TodaysFeature />
      <WhyChoose />
      <Package />
      <Members />
      <LiveOddsPicks />
      <GetFreeDailyPicks />
      <LatestBettingInsights />
      <WhyChoose />
    </div>
  );
}
