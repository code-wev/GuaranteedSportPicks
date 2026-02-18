import ContactForm from '@/components/contact/ContactForm';
import FAQContact from '@/components/contact/FaqContact';
import VisitOurOffice from '@/components/contact/VisitOurOffice';
import ContactBanner from '@/components/contact/ContactBanner';
import React from 'react';

const page = () => {
    return (
        <div>
            <ContactBanner/>
            <ContactForm/>
            <VisitOurOffice/>
            <FAQContact/>
        </div>
    );
};

export default page;