import { Link } from '@tanstack/react-router';
import { SiteSearch } from '@/components/command';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  return (
    <header className="p-2 px-4 mx-4 rounded-b-lg border flex justify-between items-center z-10">
      <nav className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg text-primary">
          tvk-utils
        </Link>
        <p className="text-muted-foreground text-sm hidden md:block">
          Press{' '}
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>J
          </kbd>{' '}
          to search for tools.
        </p>
      </nav>

      <div className="flex gap-4">
        <SiteSearch />
        <ThemeToggle />
      </div>
    </header>
  );
}
