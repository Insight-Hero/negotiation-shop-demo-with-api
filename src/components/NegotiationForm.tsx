"use client";

import { useEffect, useState } from "react";

// Define the structure of a stored discount in localStorage
interface StoredDiscount {
  productId: number;
  target: number[]; // Array of variant IDs this discount applies to
  discountCode: string; // Discount code from the API
  discount: number; // Discount amount in currency units
  timestamp: number; // Unix Time Stamp when the discount was generated
}

export default function NegotiationForm({
  productVariant,
}: {
  productVariant: {
    productId: number;
    variantId: number;
    price: number;
  };
}) {
  // State for the user's offer input
  const [offer, setOffer] = useState("");

  // State for displaying messages to the user
  const [message, setMessage] = useState("");

  // State for the discount code from the API
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // State for the discount amount from the API
  const [discountValue, setDiscountValue] = useState<number | null>(null);

  // State to toggle between negotiation form and Buy Now button
  const [showBuyNow, setShowBuyNow] = useState(false);

  // Key for storing discounts in localStorage, unique per product
  const discountKey = `discounts_${productVariant.productId}`;

  // Load and check stored discounts on mount
  useEffect(() => {
    // Load existing discounts from localStorage
    const storedDiscounts: StoredDiscount[] = JSON.parse(
      localStorage.getItem(discountKey) || "[]"
    );
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Remove discounts older than 24 hours and update localStorage
    const validDiscounts = storedDiscounts.filter(
      (d) => now - d.timestamp < twentyFourHours
    );
    if (validDiscounts.length !== storedDiscounts.length) {
      localStorage.setItem(discountKey, JSON.stringify(validDiscounts));
    }

    // Check if current variantId is in a valid discount's target
    const matchingDiscount = validDiscounts.find((d) =>
      d.target.includes(productVariant.variantId)
    );

    if (matchingDiscount) {
      // If a valid discount exists, show the Buy Now button with details
      setMessage(
        `You have a previous ${
          matchingDiscount.discountCode ? "accepted" : "special"
        } offer of $${matchingDiscount.discount.toFixed(2)} for this product.`
      );
      setDiscountCode(matchingDiscount.discountCode);
      setDiscountValue(matchingDiscount.discount);
      setShowBuyNow(true);
    } else {
      // If no valid discount, reset state to show the negotiation form
      setMessage("");
      setDiscountCode(null);
      setDiscountValue(null);
      setShowBuyNow(false);
    }
  }, [productVariant.variantId, discountKey]); // Re-run when variantId or discountKey changes

  // Handle form submission to send an offer to the API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const offerNum = parseFloat(offer);

    // Validate offer
    if (isNaN(offerNum)) {
      setMessage("Offer must be valid number");
      return;
    }

    if (offerNum > productVariant.price) {
      setMessage("Offer must lesss than or equal to product's price");
      return;
    }

    try {
      // Send the offer to Insight-Hero API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({
            productId: productVariant.productId,
            variantId: productVariant.variantId,
            bid: offerNum,
          }),
        }
      );

      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "Something went wrong");
        return;
      }

      const data = await response.json();
      console.log(data); // For debugging API response

      // Process API response and set appropriate message
      if (data.value) {
        // Case 1: Offer Accepted
        setMessage(
          `Congrats! Your offer of $${offerNum.toFixed(2)} was accepted!`
        );
        setDiscountCode(data.discountCode || null);
      } else if (data.isPreviousAccepted) {
        // Case 2: Previous Accepted or Special Offer Exists
        setMessage(
          `You already have a previous ${
            data.isSpecialOffer ? "special" : "accepted"
          } offer of $${(productVariant.price - data.discount).toFixed(
            2
          )} for this product.`
        );
        setDiscountCode(data.discountCode || null);
        setDiscountValue(data.discount);
        setShowBuyNow(true);
        storeDiscount(
          data.target,
          data.discountCode,
          data.discount,
          data.blockTime
        );
      } else if (data.isSpecialOffer) {
        // Case 3: After 3rd Time Rejected, Special Offer Created
        setMessage(
          `Offer rejected. Special offer created: $${(
            productVariant.price - data.discount
          ).toFixed(2)}. Use it before it expires!`
        );
        setDiscountCode(data.discountCode || null);
        setDiscountValue(data.discount);
        setShowBuyNow(true);
        storeDiscount(
          data.target,
          data.discountCode,
          data.discount,
          data.blockTime
        );
      } else {
        // Case 4: Rejected (with chances remaining)
        setMessage(
          `Offer rejected. You have ${data.bidsLeft} chance${
            data.bidsLeft === 1 ? "" : "s"
          } left. Try a higher amount!`
        );
        setDiscountCode(null); // No discount code for rejection
        setDiscountValue(null); // Clear discount value
      }

      setOffer(""); // Clear the input field after submission
    } catch (error) {
      console.error("Error submitting offer:", error);
      setMessage("Failed to submit offer. Please try again.");
    }
  };

  // Function to store discount details in localStorage
  const storeDiscount = (
    target: number[],
    discountCode: string,
    discount: number,
    timeStamp: number
  ) => {
    const storedDiscounts: StoredDiscount[] = JSON.parse(
      localStorage.getItem(discountKey) || "[]"
    );

    const newDiscount: StoredDiscount = {
      productId: productVariant.productId,
      target: target.map(Number), // Ensure target is stored as numbers
      discountCode,
      discount,
      timestamp: timeStamp || Date.now(),
    };

    // Remove any existing discount for this variantId and add the new one
    const updatedDiscounts = [
      ...storedDiscounts.filter(
        (d) => !d.target.includes(productVariant.variantId)
      ),
      newDiscount,
    ];
    localStorage.setItem(discountKey, JSON.stringify(updatedDiscounts));
  };

  // Handle Buy Now button click (placeholder for actual purchase)
  const handleBuyNow = () => {
    const discountedPrice = productVariant.price - (discountValue || 0);
    alert(
      `You will buy it for $${discountedPrice.toFixed(2)} with discount code: ${
        discountCode || "N/A"
      }`
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {showBuyNow ? (
        <>
          <p className="text-center text-sm text-gray-600">{message}</p>
          {discountCode && discountCode !== "" && (
            <p className="mt-2 text-center text-sm text-green-600">
              Discount Code: {discountCode}
            </p>
          )}
          <button
            onClick={handleBuyNow}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Buy Now
          </button>
        </>
      ) : (
        // Show negotiation form when no valid discount exists
        <>
          <h3 className="text-lg font-semibold mb-4">Make an Offer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="offer"
                className="block text-sm font-medium text-gray-700"
              >
                Your Offer ($)
              </label>
              <input
                type="number"
                id="offer"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                step="0.01"
                min="0"
                className="mt-1 px-2 py-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
            >
              Submit Offer
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
          {discountCode && (
            <p className="mt-2 text-center text-sm text-green-600">
              Discount Code: {discountCode}
            </p>
          )}
        </>
      )}
    </div>
  );
}
