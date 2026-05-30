import { NavbarWrapper } from "@/components/shared/NavbarWrapper";
import { Footer } from "@/components/shared/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarWrapper />
      <main>{children}</main>
      <Footer />
    </>
  );
}
