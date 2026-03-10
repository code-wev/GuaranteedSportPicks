"use client";
import React, { useState } from "react";
import OrderSummary from "@/components/Dashboard/Purchase/OrderSummary";
import PaymentModel from "@/components/Dashboard/Purchase/PaymentModel";
import SelectPackage from "@/components/Dashboard/Purchase/SelectPackage";
import SelectSport from "@/components/Dashboard/Purchase/SelectSport";
import PromoCode from "@/components/packages/PromoCode";
import { useCreateSubscriptionMutation } from "@/feature/PaymentApi";

export default function Purchase() {
  const [packageName, setPackageName] = useState(null);
  const [selectedSport, setSelectedSport] = useState([]);
  const [paymentModel, setPaymentModel] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [seasonalDays, setSeasonalDays] = useState("");
  const [seasonalPrice, setSeasonalPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [createSubscription, {isLoading, isError, error}] = useCreateSubscriptionMutation();

  // Handle API errors
  React.useEffect(() => {
    if (isError && error) {
      let message = "An error occurred while creating subscription";
      
      if (error?.data?.message) {
        message = error.data.message;
      } else if (error?.data?.errors && Array.isArray(error.data.errors)) {
        message = error.data.errors.map(err => err.message).join(", ");
      } else if (error?.error) {
        message = error.error;
      }
      
      setErrorMessage(message);
      setSuccessMessage("");
    }
  }, [isError, error]);

  // Clear messages when user starts interacting
  React.useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000); // Auto-hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Client-side validation
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

  const handlePurchase = async() => {
    setErrorMessage(""); // Clear previous errors
    setSuccessMessage("");
    
    if (!validateForm()) {
      return;
    }
    
    const purchaseData = {
      packageName,
      selectedSport,
      ...(packageName === "SEASONAL" && {
        isSeasonal: true,
        seasonalDays: parseInt(seasonalDays),
        seasonalPrice: parseFloat(seasonalPrice),
      }),
    };

    try {
      const resp = await createSubscription(purchaseData).unwrap();
      if (resp?.url) {
        setSuccessMessage("Redirecting to payment...");
        setTimeout(() => {
          window.location.href = resp.url;
        }, 1000); // Small delay to show success message
      } else {
        setErrorMessage("Failed to get payment URL. Please try again.");
      }
    } catch (err) {
      // Error is already handled by the useEffect above
      console.error("Purchase error:", err);
    }
  };

  const handlePackageSelect = (pkg) => {
    setPackageName(pkg);
    setValidationErrors(prev => ({ ...prev, packageName: undefined }));
  };

  const handleSportSelect = (sports) => {
    setSelectedSport(sports);
    setValidationErrors(prev => ({ ...prev, selectedSport: undefined }));
  };

  const handleSeasonalDaysChange = (value) => {
    setSeasonalDays(value);
    setValidationErrors(prev => ({ ...prev, seasonalDays: undefined }));
  };

  const handleSeasonalPriceChange = (value) => {
    setSeasonalPrice(value);
    setValidationErrors(prev => ({ ...prev, seasonalPrice: undefined }));
  };

  const calculateTotal = () => {
    if (packageName === "SEASONAL") {
      return parseFloat(seasonalPrice) || 0;
    }
    const packagePrices = {
      "DAILY": 25.00,
      "WEEKLY": 99.00,
      "MONTHLY": 299.00
    };
    
    return packagePrices[packageName] || 0;
  };

  return (
    <div className="p-4 md:p-8 bg-[#fafafa] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Purchase Picks</h1>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {errorMessage}
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setErrorMessage("")}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Success
              </h3>
              <div className="mt-2 text-sm text-green-700">
                {successMessage}
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccessMessage("")}
                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
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
        onPurchase={handlePurchase}
        isLoading={isLoading}
      />
    </div>
  );
}