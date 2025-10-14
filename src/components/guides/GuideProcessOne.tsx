import GuideParaCard from "./card/GuideCard";

export default function GuideProcessOne() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Application Timeline
        </h2>
        <p className="text-muted-foreground">
          Follow these steps for a smooth application journey
        </p>
      </div>

      <div className="space-y-4">
        <GuideParaCard
          step={1}
          title="Find School"
          description="Begin checking the school's information, admission guidelines, and specific requirements together for the application process around 8–12 months in advance."
        />
        <GuideParaCard
          step={2}
          title="Submit & Apply to School"
          description="Complete the application documents and apply for the school. Pay the application fee. 8-12 months before."
        />
        <GuideParaCard
          step={3}
          title="Apply to COE(Certificate of Eligibility)"
          description="Upon the approval of COE and acceptance of enrollment, make the payment of fees including tuition and accommodation. 1-3 months before."
        />
        <GuideParaCard
          step={4}
          title="Make the Payment"
          description="Upon the approval of COE and acceptance of enrollment, make the payment of fees including tuition and accommodation. 1-3 months before."
        />
        <GuideParaCard
          step={5}
          title="Apply to Student Visa"
          description="With the COE documents, apply for visa at the embassy/consulate-general of Japan in your country. 1 months before."
        />
        <GuideParaCard
          step={6}
          title="Travel Preparation"
          description="Get a flight ticket and insurance. Prepare daily essentials for you to explore your story in Japan."
        />
        <GuideParaCard
          step={7}
          title="Welcome to Japan!!!"
          isLast={true}
          description=""
        />
      </div>
    </div>
  );
}
