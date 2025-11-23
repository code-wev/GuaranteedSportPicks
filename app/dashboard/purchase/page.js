import OrderSummary from "@/components/Dashboard/Purchase/OrderSummary";
import PaymentModel from "@/components/Dashboard/Purchase/PaymentModel";
import SelectPackage from "@/components/Dashboard/Purchase/SelectPackage";
import SelectSport from "@/components/Dashboard/Purchase/SelectSport";
import PromoCode from "@/components/packages/PromoCode";


export default function Purchase() {
  return (
    <div className="p-4 md:p-8 bg-[#fafafa] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Purchase Picks</h1>
      <PaymentModel />
      <SelectPackage />
      <SelectSport />
      <PromoCode />
      <OrderSummary/>
    </div>
  );
}
