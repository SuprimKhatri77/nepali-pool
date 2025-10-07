import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";

export default function DashboardCard() {
  return (
    <Card>
      <CardHeader>Profile Views</CardHeader>
      <CardFooter className="text-xl font-bold">
        10 <sub>+</sub>
      </CardFooter>
    </Card>
  );
}
