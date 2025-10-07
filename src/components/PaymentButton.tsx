"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PaymentButtonProps } from "../../types/all-types";
import Loader from "./Loader";

export function PaymentButton({
  paymentType,
  userId,
  mentorId,
  userEmail,
  children,
  className,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentType,
          userId,
          mentorId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data.error);
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} className={className}>
      {loading ? <Loader /> : children}
    </Button>
  );
}
