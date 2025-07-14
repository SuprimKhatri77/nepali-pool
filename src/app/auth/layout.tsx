
export default function AuthLayout({ children }: Readonly < { children: React.ReactNode }>) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1F406B] to-[#D7FCFF]">
        {children}
    </main>
  )
}
