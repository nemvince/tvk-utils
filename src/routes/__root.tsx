import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

interface Site {
  name: string
  href: string
}

const sites: Site[] = [
  {
    name: 'Index',
    href: '/',
  }
]

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <header className="p-2 flex justify-between items-center">
        <nav>
          {sites.map((site) => (
          <Link key={site.href} to={site.href} className="[&.active]:font-bold">
          {site.name}
        </Link>
        ))}
        </nav>
        <ThemeToggle />
      </header>
      <hr />
      <Outlet />
    </ThemeProvider>
  ),
})