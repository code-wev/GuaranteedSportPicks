import ExpertPicks from '@/components/FreePicks/ExpertPicks';
import FreePicksBanner from '@/components/FreePicks/FreePicksBanner';
import WinningPicks from '@/components/FreePicks/WinningPicks';
import React from 'react';

const page = () => {
    return (
        <div>
            <FreePicksBanner/>
            <ExpertPicks/>
            <WinningPicks/>
        </div>
    );
};

export default page;