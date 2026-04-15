"use client";

import OrderSummary from "@/components/Dashboard/Purchase/OrderSummary";
import SelectPackage from "@/components/Dashboard/Purchase/SelectPackage";
import SelectSport from "@/components/Dashboard/Purchase/SelectSport";
import {
  useCreatePickPurchaseMutation,
  useCreateSubscriptionMutation,
  useGetMySubscriptionQuery,
} from "@/feature/PaymentApi";
import { useGetManyPicksQuery } from "@/feature/PicksApi";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export default function Purchase() {
  const [packageName, setPackageName] = useState(null);
  const [selectedSport, setSelectedSport] = useState([]);
  const [seasonalDays, setSeasonalDays] = useState("");
  const [seasonalPrice, setSeasonalPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [
    createSubscription,
    { isLoading: isCreatingSubscription, isError, error },
  ] = useCreateSubscriptionMutation();
  const [createPickPurchase, { isLoading: isCreatingPickPurchase }] =
    useCreatePickPurchaseMutation();
  const { data: subscriptionData } = useGetMySubscriptionQuery();
  const { data: picksData, isLoading: isLoadingPicks } = useGetManyPicksQuery({
    pageNo: 1,
    showPerPage: 100,
  });

  const activeSubscription = subscriptionData?.data;
  const activePremiumPicks = useMemo(() => {
    const picks = picksData?.data?.pickss || [];
    return picks.filter((pick) => pick.premium && pick.status === "active");
  }, [picksData]);

  React.useEffect(() => {
    if (isError && error) {
      let message = "An error occurred while creating subscription";

      if (error?.data?.message) {
        message = error.data.message;
      } else if (error?.data?.errors && Array.isArray(error.data.errors)) {
        message = error.data.errors.map((err) => err.message).join(", ");
      } else if (error?.error) {
        message = error.error;
      }

      setErrorMessage(message);
      setSuccessMessage("");
    }
  }, [isError, error]);

  React.useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const validateForm = () => {
    const errors = {};

    if (!packageName) {
      errors.packageName = "Please select a package";
    }

    if (selectedSport.length === 0) {
      errors.selectedSport = "Please select at least one sport";
    }

    if (packageName === "SEASONAL") {
      if (!seasonalDays || parseInt(seasonalDays) < 1) {
        errors.seasonalDays = "Please enter valid number of days (minimum 1)";
      }
      if (!seasonalPrice || parseFloat(seasonalPrice) < 1) {
        errors.seasonalPrice = "Please enter valid price (minimum $1.00)";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubscriptionPurchase = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    const purchaseData = {
      packageName,
      selectedSport,
      price: calculateTotal(),
      ...(packageName === "SEASONAL" && {
        isSeasonal: true,
        seasonalDays: parseInt(seasonalDays),
        seasonalPrice: parseFloat(seasonalPrice),
      }),
    };

    try {
      const resp = await createSubscription(purchaseData).unwrap();
      const paymentLink = resp?.data?.paymentLink;

      if (paymentLink) {
        setSuccessMessage("Redirecting to Stripe checkout...");
        setTimeout(() => {
          window.location.href = paymentLink;
        }, 700);
      } else {
        setErrorMessage("Failed to get payment URL. Please try again.");
      }
    } catch (err) {
      console.error("Subscription purchase error:", err);
    }
  };

  const handlePickPurchase = async (pickId, paymentModel) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const resp = await createPickPurchase({
        pickId,
        paymentModel,
      }).unwrap();

      const paymentLink = resp?.data?.paymentLink;
      if (!paymentLink) {
        setErrorMessage("Failed to create pick checkout session.");
        return;
      }

      setSuccessMessage(
        paymentModel === "PAY_AFTER_WIN"
          ? "Redirecting to secure Pay After Win authorization..."
          : "Redirecting to secure prepaid checkout...",
      );

      setTimeout(() => {
        window.location.href = paymentLink;
      }, 700);
    } catch (err) {
      setErrorMessage(err?.data?.message || "Unable to start pick purchase.");
    }
  };

  const handlePackageSelect = (pkg) => {
    setPackageName(pkg);
    setValidationErrors((prev) => ({ ...prev, packageName: undefined }));
  };

  const handleSportSelect = (sports) => {
    setSelectedSport(sports);
    setValidationErrors((prev) => ({ ...prev, selectedSport: undefined }));
  };

  const handleSeasonalDaysChange = (value) => {
    setSeasonalDays(value);
    setValidationErrors((prev) => ({ ...prev, seasonalDays: undefined }));
  };

  const handleSeasonalPriceChange = (value) => {
    setSeasonalPrice(value);
    setValidationErrors((prev) => ({ ...prev, seasonalPrice: undefined }));
  };

  const calculateTotal = () => {
    if (packageName === "SEASONAL") {
      return parseFloat(seasonalPrice) || 0;
    }

    const packagePrices = {
      DAILY: 25.0,
      WEEKLY: 99.0,
      MONTHLY: 299.0,
    };

    return packagePrices[packageName] || 0;
  };

  return (
    <div className='p-4 md:p-8 bg-[#fafafa] min-h-screen space-y-10'>
      <div>
        <h1 className='text-2xl font-semibold mb-2'>Purchase Access</h1>
        <p className='text-gray-500'>
          Buy a subscription for ongoing access, or purchase a single premium
          pick with prepaid or Pay After Win.
        </p>
        <Link
          href='/dashboard/cart'
          className='inline-block mt-3 text-sm font-semibold text-red-700 hover:underline'>
          View Cart & Purchase Tracker
        </Link>
      </div>

      {(errorMessage || successMessage) && (
        <div
          className={`rounded-lg p-4 border ${
            errorMessage
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}>
          {errorMessage || successMessage}
        </div>
      )}

      {activeSubscription && (
        <div className='bg-white border border-green-200 rounded-xl p-5'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Active Subscription
          </h2>
          <p className='text-sm text-gray-600 mt-1'>
            Your current plan already unlocks all premium picks. You do not need
            to buy single picks separately.
          </p>
        </div>
      )}

      <section className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            1. Subscription Plans
          </h2>
          <p className='text-sm text-gray-500 mt-1'>
            Best if you want access to all premium picks in the selected sports
            during the plan period.
          </p>
        </div>

        <SelectPackage
          selectedPackage={packageName}
          onSelectPackage={handlePackageSelect}
          seasonalDays={seasonalDays}
          setSeasonalDays={handleSeasonalDaysChange}
          seasonalPrice={seasonalPrice}
          setSeasonalPrice={handleSeasonalPriceChange}
          validationErrors={validationErrors}
        />

        <SelectSport
          selectedSport={selectedSport}
          onSelectSport={handleSportSelect}
          validationErrors={validationErrors}
        />

        <OrderSummary
          packageName={packageName}
          selectedSport={selectedSport}
          seasonalDays={seasonalDays}
          seasonalPrice={seasonalPrice}
          total={calculateTotal()}
          onPurchase={handleSubscriptionPurchase}
          isLoading={isCreatingSubscription}
        />
      </section>

      <section className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            2. Buy Individual Premium Picks
          </h2>
          <p className='text-sm text-gray-500 mt-1'>
            `Prepaid` charges immediately. `Pay After Win` places a card
            authorization hold and only captures it if the pick wins.
          </p>
        </div>

        {isLoadingPicks ? (
          <div className='bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500'>
            Loading premium picks...
          </div>
        ) : activePremiumPicks.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500'>
            No active premium picks are available right now.
          </div>
        ) : (
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
            {activePremiumPicks.map((pick) => {
              const coveredBySubscription = Boolean(activeSubscription);

              return (
                <div
                  key={pick._id}
                  className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'>
                  <div className='flex items-start justify-between gap-4 mb-4'>
                    <div>
                      <p className='text-xs uppercase tracking-[0.18em] text-red-600 font-bold'>
                        {pick.sport_title}
                      </p>
                      <h3 className='text-xl font-bold text-gray-900 mt-1'>
                        {pick.away_team}{" "}
                        <span className='text-[#B91C1C]'>VS</span>{" "}
                        {pick.home_team}
                      </h3>
                      <p className='text-sm text-gray-500 mt-1'>
                        {new Date(pick.commence_time).toLocaleString()}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-gray-400'>Single Pick Price</p>
                      <p className='text-2xl font-bold text-[#B91C1C]'>
                        ${Number(pick.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4 text-sm mb-5'>
                    <div className='rounded-xl bg-gray-50 p-3'>
                      <p className='text-gray-400'>Market</p>
                      <p className='font-semibold capitalize text-gray-800'>
                        {pick.market_type}
                      </p>
                    </div>
                    <div className='rounded-xl bg-gray-50 p-3'>
                      <p className='text-gray-400'>Confidence</p>
                      <p className='font-semibold capitalize text-gray-800'>
                        {pick.confidence}
                      </p>
                    </div>
                    <div className='rounded-xl bg-gray-50 p-3 col-span-2'>
                      <p className='text-gray-400'>Selected Team</p>
                      <p className='font-semibold text-gray-800'>
                        {pick.selected_team || "Not set yet"}
                      </p>
                    </div>
                  </div>

                  {coveredBySubscription ? (
                    <div className='rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium'>
                      Included in your active subscription for{" "}
                      {pick.sport_title}.
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <button
                        onClick={() => handlePickPurchase(pick._id, "PREPAID")}
                        disabled={isCreatingPickPurchase}
                        className='rounded-xl bg-[#B91C1C] text-white py-3 font-semibold hover:bg-red-800 disabled:opacity-50'>
                        {isCreatingPickPurchase
                          ? "Please wait..."
                          : "Buy Prepaid"}
                      </button>
                      <button
                        onClick={() =>
                          handlePickPurchase(pick._id, "PAY_AFTER_WIN")
                        }
                        disabled={isCreatingPickPurchase}
                        className='rounded-xl border border-[#B91C1C] text-[#B91C1C] py-3 font-semibold hover:bg-red-50 disabled:opacity-50'>
                        {isCreatingPickPurchase
                          ? "Please wait..."
                          : "Pay After Win"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
