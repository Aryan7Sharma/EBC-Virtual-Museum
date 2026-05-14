// import { Header } from "./header";
// import { Footer } from "./footer";
import { NewHeader } from "../new-home/header";
import { NewFooter } from "../new-home/footer";
interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NewHeader />
      <main className="flex-1">{children}</main>
      {showFooter && <NewFooter />}
    </div>
  );
}
