import Link from "next/link";
import { ArrowRight, Briefcase, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MentorServiceSelectType } from "../../../lib/db/schema";
import { formatDuration, formatNpr } from "./format";

type Props = {
  mentorId: string;
  services: MentorServiceSelectType[];
  acceptingBookings: boolean;
  canBook: boolean;
};

export default function MentorServicesSection({
  mentorId,
  services,
  acceptingBookings,
  canBook,
}: Props) {
  if (services.length === 0) return null;

  return (
    <Card id="services" className="border border-slate-200 shadow-lg mb-8 scroll-mt-24">
      <CardContent className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            Services Offered
          </h2>
          {!acceptingBookings ? (
            <p className="text-sm text-amber-700">
              This mentor isn&apos;t taking bookings right now.
            </p>
          ) : (
            !canBook && (
              <p className="text-sm text-slate-500">
                Only student accounts can book services.
              </p>
            )
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const duration = formatDuration(service.durationMinutes);
            return (
              <div
                key={service.id}
                className="flex flex-col rounded-xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-slate-900 break-words">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 whitespace-pre-line break-words line-clamp-4">
                  {service.description}
                </p>
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mb-3">
                    <span className="font-bold text-slate-900">
                      {formatNpr(service.priceNpr)}
                    </span>
                    {duration && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> {duration}
                      </span>
                    )}
                  </div>
                  {acceptingBookings && canBook && (
                    <Button
                      asChild
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Link href={`/mentors/${mentorId}/book/${service.id}`}>
                        Book now <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
