import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';
import { createPortal } from 'react-dom';
import { SiteSearch } from '@/components/command';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        name: 'description',
        content: 'sometimes awesome utils for developers',
      },
      {
        title: 'tvk-utils',
      },
    ],
  }),
  component: () => (
    <>
      {createPortal(<HeadContent />, document.head)}

      <ThemeProvider>
        <Navbar />
        <SiteSearch />
        <div className="grow m-4 border rounded-lg p-4 flex flex-col backdrop-blur-xs">
          <Outlet />
        </div>
        <Footer />
      </ThemeProvider>
    </>
  ),
});
