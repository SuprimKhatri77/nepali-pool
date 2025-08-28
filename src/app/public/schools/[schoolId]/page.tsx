"use client";
import { useParams } from "next/navigation";

export default function SpecificSchoolView() {
  const params = useParams();
  const { schoolId } = params;
  return <div>SpecificSchoolView {schoolId}</div>;
}
