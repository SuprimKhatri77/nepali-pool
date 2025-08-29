import React from "react";
import SchoolCard from "../reusableComponents/SchoolCard";
import { SchoolSelectType } from "../../../../../../lib/db/schema";
import { db } from "../../../../../../lib/db";

export default async function SchoolList({
  Header,
}: {
  readonly Header: string;
}) {
  const schools: SchoolSelectType[] = await db.query.school.findMany();
  return (
    <section className="bg-white text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-screen pb-8 mb-8">
      <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
        {Header || "Schools List"}
      </h1>
      <hr className="border-2 border-yellow-400 w-12 mx-auto" />
      <div id="container" className="mt-6 flex gap-12 flex-wrap justify-center">
        {/* load cards here! */}
        {schools.map((school, i) => {
          return <SchoolCard {...school} key={i + 1} />;
        })}
      </div>
    </section>
  );
}
