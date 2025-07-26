
export default function AuthLayout({ children }: Readonly < { children: React.ReactNode }>) {

  
  return (
    <main className="min-h-screen max-w-full w-full flex items-center justify-center  bg-gradient-to-r from-[#bedfff] via-[#e4f4ff] to-white">
        {children}
    </main>
  )
}
