import { AppSidebar } from "~/components/app-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  header: string;
}

export default function SidebarLayout({
  children,
  currentRoute,
  header,
}: SidebarLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar currentRoute={currentRoute} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <h2>{header}</h2>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
