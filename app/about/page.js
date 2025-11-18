import Expert from '@/components/About/Expert';
import MissionPromise from '@/components/About/MissionPromise';
import TrackRecordGlance from '@/components/About/TrackRecordGlance';
import TrackRecordIcons from '@/components/About/TrackRecordIcons';
import WhoWeAre from '@/components/About/WhoWeAre';
import React from 'react';

const page = () => {
    return (
        <div>
            <WhoWeAre/>
            <MissionPromise/>
            <Expert/>
            <TrackRecordGlance/>
            <TrackRecordIcons/>
        </div>
    );
};

export default page;