export type RouteMeta = {
  name: string;
  description: string;
};

export type GroupMeta = {
  name: string;
};

type GroupModule = { groupMeta: GroupMeta };

type RouteModule = { routeMeta: RouteMeta };

type Module = GroupModule | RouteModule;

type Site = {
  name: string;
  description: string;
  href: string;
};

type Group = {
  name: string;
  id: string;
  children: Site[];
};

const toolContext = import.meta.webpackContext('@/routes/tools', {
  recursive: true,
  regExp: /\.(ts|tsx)$/,
});

const generateSiteTree = (): Group[] => {
  const routes: [string, Module][] = toolContext
    .keys()
    .map((path) => [path, toolContext(path) as Module]);

  const uncategorized: Group = { name: 'Uncategorized', id: '.', children: [] };
  const tree: Group[] = routes
    .filter(([, mod]) => 'groupMeta' in mod)
    .map(([path, mod]) => {
      const meta = (mod as GroupModule).groupMeta;
      return {
        name: meta.name,
        id: path.split('/')[1],
        children: [],
      } as Group;
    });

  tree.push(uncategorized);

  for (const [path, mod] of routes) {
    if (!('routeMeta' in mod)) continue;

    const meta = (mod as RouteModule).routeMeta;
    const parts = path.split('/').filter((p) => p && p !== '.');
    const href = `/tools/${parts.join('/').replace(/\.tsx?$/, '')}`;

    const site: Site = {
      name: meta.name,
      description: meta.description,
      href,
    };

    const group =
      parts.length > 1 ? tree.find((g) => g.id === parts[0]) : undefined;

    (group ?? uncategorized).children.push(site);
  }

  return tree;
};

export const siteTree = generateSiteTree();
