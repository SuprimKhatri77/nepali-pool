import PaymentSuccess from "@/components/PaymentSuccess";
import React from "react";

type Props = {
  searchParams: Promise<{ session_id: string }>;
};

const page = async ({ searchParams }: Props) => {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <div className="flex flex-col">
        <h1>Incomplete payment</h1>
      </div>
    );
  }
  return <PaymentSuccess />;
};

export default page;
