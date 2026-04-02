import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function AppSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1">
        <Navbar />

        <main className="p-6 bg-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

// import { AppContent } from '@/components/app-content';
// import { AppShell } from '@/components/app-shell';
// import { AppSidebar } from '@/components/app-sidebar';
// import { AppSidebarHeader } from '@/components/app-sidebar-header';
// import type { AppLayoutProps } from '@/types';

// export default function AppSidebarLayout({
//     children,
//     breadcrumbs = [],
// }: AppLayoutProps) {
//     return (
//         <AppShell variant="sidebar">
//             <AppSidebar />
//             <AppContent variant="sidebar" className="overflow-x-hidden">
//                 <AppSidebarHeader breadcrumbs={breadcrumbs} />
//                 {children}
//             </AppContent>
//         </AppShell>
//     );
// }

