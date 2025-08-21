import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { type Anchor, type Menu, type Site, siteTree } from '@/lib/routes';
import { useNavigate } from '@tanstack/react-router';

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

  const formatSiteTree = (tree: Site[]) => {
    const anchors: Anchor[] = [];
    const menus: Menu[] = [];
    tree.forEach((site) => {
      if (site.type === 'anchor') {
        anchors.push(site);
      } else if (site.type === 'menu') {
        menus.push(site);
      }
    });
    const result = [...menus] as Menu[];
    if (anchors.length > 0) {
      result.unshift({
        href: '/',
        name: 'Uncategorized',
        type: 'menu',
        children: anchors,
      });
    }
    return result;
  };

  const formatted = formatSiteTree(siteTree);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg border shadow-md md:min-w-[450px]"
    >
      <CommandInput placeholder="Search for a site..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {formatted.map((site) => (
          <CommandGroup key={site.name} heading={site.name}>
            {site.children.map((child) => (
              <CommandItem
                key={child.href}
                value={`${site.href}/${child.href}`}
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
  );
}
