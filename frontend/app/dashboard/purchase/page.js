"use client";
import { useState } from "react";
import OrderSummary from "@/components/Dashboard/Purchase/OrderSummary";
import PaymentModel from "@/components/Dashboard/Purchase/PaymentModel";
import SelectPackage from "@/components/Dashboard/Purchase/SelectPackage";
import SelectSport from "@/components/Dashboard/Purchase/SelectSport";
import PromoCode from "@/components/packages/PromoCode";
import { useCreateSubscriptionMutation } from "@/feature/PaymentApi";

export default function Purchase() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [paymentModel, setPaymentModel] = useState(null);
  const [promoCode, setPromoCode] = useState("");


  const [createSubscription, {isLoading, isError, error}] = useCreateSubscriptionMutation();

  if(isError){
    console.log(error, "rakib vudaiyer error")
  }

  const handlePurchase = async() => {
    const purchaseData = {
      packageName: selectedPackage.name,
      userId:"6925408a8fd14a9ef3d4f461",
      priceId:"price_1SYNV7P0aOrzI3fiwBc0carl",
      category: selectedSport.name,
      paymentModel: paymentModel,
      promoCode: promoCode,
      cancelUrl:"https://e-paper-three.vercel.app/",
      successUrl:"successUrl",
      amount: calculateTotal(),
      currency:"USD",
      type:"subscription"
    };


    const resp = await createSubscription(purchaseData);
    console.log(resp?.data?.url, "you are my personal reps")
  window.location.href = resp?.data?.url;

    
    console.log("Purchase Data:", purchaseData);
    alert("Check console for purchase data!");
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    const packagePrices = {
      "Daily Pick": 25.00,
      "Weekly Pick": 99.00,
      "Monthly Pick": 299.00
    };
    
    return packagePrices[selectedPackage.name] || 0;
  };

  return (
    <div className="p-4 md:p-8 bg-[#fafafa] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Purchase Picks</h1>
      
      <PaymentModel 
        selectedModel={paymentModel} 
        onSelectModel={setPaymentModel} 
      />
      
      <SelectPackage 
        selectedPackage={selectedPackage} 
        onSelectPackage={setSelectedPackage} 
      />
      
      <SelectSport 
        selectedSport={selectedSport} 
        onSelectSport={setSelectedSport} 
      />
      
      <PromoCode 
        promoCode={promoCode} 
        onPromoCodeChange={setPromoCode} 
      />
      
      <OrderSummary 
        selectedPackage={selectedPackage}
        selectedSport={selectedSport}
        paymentModel={paymentModel}
        promoCode={promoCode}
        onPurchase={handlePurchase}
      />
    </div>
  );
}