import { Suspense } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FloatingCTA from "@/components/common/FloatingCTA";
import { LeadModalProvider } from "@/components/client/LeadModalProvider";

export default function PublicLayout({ children }) {
  return (
    <LeadModalProvider>
      <Suspense fallback={<div className="h-16 bg-surface-container-lowest" />}>
        <Header />
      </Suspense>
      <main>{children}</main>
      <Footer />
      <FloatingCTA />
    </LeadModalProvider>
  );
}