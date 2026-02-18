import ExpertPicksHero from "@/components/Home/ExpertPicksHero";
import GetFreeDailyPicks from "@/components/Home/GetFreeDailyPicks";
import GetSportsPicks from "@/components/Home/GetSportsPicks";
import HomeBanner from "@/components/Home/HomeBanner";
import LatestBettingInsights from "@/components/Home/LatestBettingInsights";
import LiveOddsPicks from "@/components/Home/LiveOddsPicks";
import Members from "@/components/Home/Members";
import Package from "@/components/Home/Package";
import StatsOverview from "@/components/Home/StatsOverview";
import TodaysFeature from "@/components/Home/TodaysFeature";
import TrustedPartners from "@/components/Home/TrustedPartners";
import WhyChoose from "@/components/Home/WhyChoose";

export default function Page() {
  return (
    <div>
      <HomeBanner />
      {/* <TodaysFeature /> */}
      <TrustedPartners />
      <GetSportsPicks />
      <StatsOverview />
      <ExpertPicksHero />
      <Package />
      <GetFreeDailyPicks />
      <WhyChoose />

      <Members />
      
      {/* <LiveOddsPicks /> */}

      <LatestBettingInsights />
    </div>
  );
}
