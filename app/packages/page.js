
import CTA from '@/components/packages/CTA';
import Faq from '@/components/packages/Faq';
import PromoCode from '@/components/packages/PromoCode';
import Subscription from '@/components/packages/Subscription';
import React from 'react';

const page = () => {
    return (
        <div>
            <Subscription/>
            <PromoCode/>
            <Faq/>
            <CTA/>
        </div>
    );
};

export default page;