"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {  ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion"
import { Button } from "./ui/button";
const MotionButton = motion(Button)

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
   
  ],
}: Faq1Props) => {
  return (
    <section className="py-32 w-full px-3 sm:px-6 flex justify-center bg-gradient-to-t from-green-50 to-white">
      <div className="container w-full sm:max-w-[1440px] sm:px-0 px-6">
        <h1 className="mb-4 text-xl sm:text-3xl text-center text-emerald-500 font-semibold md:mb-11 md:text-5xl">
          {heading}
        </h1>
        <Accordion type="single" collapsible className="grid lg:grid-cols-2 lg:gap-x-12 gap-y-3">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="text-base mt-2 py-2 rounded-[4px] px-4 bg-gray-100">
              <AccordionTrigger className="font-semibold text-base hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className=" text-black">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
         <Link href={"/support"} className="flex items-center justify-center">
          <MotionButton initial={{scale:1}}  whileHover={{ scale:1.06 }} transition={{duration: 0.6, ease: "linear"}} className=" bg-emerald-600  hover:bg-emerald-700 w-[250px] h-[60px] text-base sm:text-lg  mt-6">
        Still have a query
        <ArrowRightIcon className=" font-bold size-4 " />
      </MotionButton></Link>
     
      </div>
    </section>
  );
};

export { Faq1 };
