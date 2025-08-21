import { Link } from '@tanstack/react-router';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { siteTree } from '@/lib/routes';
import type { FileRoutesByTo } from '@/routeTree.gen';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  return (
    <header className="p-2 px-4 mx-4 rounded-b-lg border flex justify-between items-center">
      <nav className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg text-primary">
          tvk-utils
        </Link>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {siteTree.map((site) => {
              switch (site.type) {
                case 'anchor':
                  return (
                    <NavigationMenuItem key={site.href}>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to={site.href}>{site.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                case 'menu':
                  return (
                    <NavigationMenuItem key={site.name}>
                      <NavigationMenuTrigger>{site.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                          <li>
                            {site.children.map((child) => (
                              <NavigationMenuLink asChild key={child.href}>
                                <Link
                                  to={
                                    `${site.href}/${child.href}` as keyof FileRoutesByTo
                                  }
                                  className="flex flex-col"
                                >
                                  <div className="font-medium">
                                    {child.name}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {child.description}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
              }
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Press{' '}
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>J
          </kbd>{' '}
          to search for tools.
        </p>
        <ThemeToggle />
      </div>
    </header>
  );
}
