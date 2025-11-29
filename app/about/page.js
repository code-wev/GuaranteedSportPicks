import AboutBanner from "@/components/About/AboutBanner";
import Expert from "@/components/About/Expert";
import MissionPromise from "@/components/About/MissionPromise";
import TrackRecordGlance from "@/components/About/TrackRecordGlance";
import TrackRecordIcons from "@/components/About/WhyChooseUs";
import WhoWeAre from "@/components/About/WhoWeAre";
import React from "react";
import WhyChooseUs from "@/components/About/WhyChooseUs";

const page = () => {
  return (
    <div>
      <AboutBanner />
      <WhoWeAre />
      <MissionPromise />
      <Expert />
      <TrackRecordGlance />
      <WhyChooseUs />
    </div>
  );
};

export default page;
