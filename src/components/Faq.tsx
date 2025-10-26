import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

const Faq1 = ({
  heading = "Frequently asked questions",
  items = [
    {
      id: "faq-1",
      question: "What is NepaliPool?",
      answer:
        "NepaliPool is a mentorship platform that connects Nepali students with experienced mentors who have already studied abroad.",
    },
    {
      id: "faq-2",
      question: "How does NepaliPool work?",
      answer:
        "Students can browse verified mentors based on country, course, or university. Once matched, they can book a one-on-one session to discuss study plans, visa guidance, lifestyle abroad, and career opportunities.",
    },
    {
      id: "faq-3",
      question: "Who can become a mentor on NepaliPool?",
      answer:
        "Anyone who has studied or is currently studying abroad can apply to become a mentor. Mentors share their real experiences and guide students through the process of studying overseas.",
    },
    {
      id: "faq-4",
      question: "Is NepaliPool free to use?",
      answer:
        "Creating a student account and browsing mentors is completely free. However, booking a one-on-one session with a mentor may have a small fee, which goes directly to the mentor for their time and support.",
    },
    {
      id: "faq-5",
      question: "What countries can mentors help me with?",
      answer:
        "Our mentors come from a variety of countries including Australia, Canada, the USA, the UK, and Japan — with more being added regularly as our mentor community grows.",
    },
    {
      id: "faq-6",
      question: "How do I book a session with a mentor?",
      answer:
        "After logging in as a student, you can visit the mentor’s profile and click on the 'Book Session' button. Choose a date and time, make the payment (if applicable), and you’ll receive a confirmation email with session details.",
    },
    {
      id: "faq-7",
      question: "Can I become both a student and a mentor?",
      answer:
        "Yes! If you are currently studying abroad, you can mentor others while also seeking guidance for higher studies or career planning from other mentors.",
    },
    {
      id: "faq-8",
      question: "How does NepaliPool ensure mentors are genuine?",
      answer:
        "Each mentor’s education background and identity are verified by our team before being listed on the platform. We prioritize authenticity, trust, and transparency in all mentor profiles.",
    },
    {
      id: "faq-9",
      question: "Do mentors help with visa and application processes?",
      answer:
        "Yes, mentors can share their personal experience with the application, SOP writing, visa interviews, and documentation process. However, NepaliPool itself is not an agent and does not process visas or university applications directly.",
    },
    {
      id: "faq-10",
      question: "How can I contact NepaliPool for support?",
      answer:
        "You can reach out to us anytime via email at nepalipool77@gmail.com or use the Contact Us form on our website. Our team will respond within 24–48 hours.",
    },
  ],
}: Faq1Props) => {
  return (
    <section className="py-32 w-full flex justify-center bg-gradient-to-t from-green-50 to-white">
      <div className="container max-w-3xl sm:px-0 px-6">
        <h1 className="mb-4 text-xl sm:text-3xl font-semibold md:mb-11 md:text-4xl">
          {heading}
        </h1>
        <Accordion type="single" collapsible >
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { Faq1 };
