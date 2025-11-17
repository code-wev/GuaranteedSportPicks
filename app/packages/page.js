import PromoCode from '@/components/packages/PromoCode';
import Subscription from '@/components/packages/Subscription';
import React from 'react';

const page = () => {
    return (
        <div>
            <Subscription/>
            <PromoCode/>
        </div>
    );
};

export default page;