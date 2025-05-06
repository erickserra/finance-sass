import { Header } from "@/components/header/header";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </>
  )
}