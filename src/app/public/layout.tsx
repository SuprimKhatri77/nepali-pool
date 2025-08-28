import Footer from "@/components/orginal-components/PUBLIC/footer/page";
import ServerHeader from "./header/Header";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <ServerHeader />
      <main className="w-full mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
