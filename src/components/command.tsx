import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { siteTree } from '@/lib/siteTree';
import { Button } from './ui/button';

export function SiteSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filtered = siteTree.filter((group) => group.children.length > 0);

  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <span className="sr-only">Search for a site</span>
        <Search className="h-5 w-5" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="rounded-lg border shadow-md md:min-w-[450px]"
      >
        <CommandInput placeholder="Search for a site..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filtered.map((item) => (
            <CommandGroup key={item.name} heading={item.name}>
              {item.children.map((child) => (
                <CommandItem
                  key={child.href}
                  value={child.href}
                  className="flex flex-col items-start"
                  onSelect={(value) => {
                    setOpen(false);
                    navigate({
                      to: value,
                    });
                  }}
                >
                  {child.name}
                  {child.description && (
                    <span className="text-xs">{child.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
