import { getSession } from "@/lib/session";
import { Navbar } from "./Navbar";

export function NavbarWrapper() {
  const session = getSession();
  return <Navbar session={session} />;
}
