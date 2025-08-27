import Footer from "@/components/orginal-components/PUBLIC/footer/page";
import ServerHeader from "./header/Header";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ServerHeader />
      <div>{children}</div>
      <Footer />
    </>
  );
}
