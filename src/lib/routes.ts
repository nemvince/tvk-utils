export type Anchor = {
  name: string;
  type: 'anchor';
  href: string;
  description?: string;
};

export type Menu = {
  name: string;
  type: 'menu';
  href: string;
  children: Anchor[];
};

export type Site = Anchor | Menu;

export const siteTree: Site[] = [
  {
    name: 'Networking Tools',
    type: 'menu',
    href: '/tools/networking',
    children: [
      {
        name: 'Minecraft SRV Record',
        type: 'anchor',
        href: 'mc-srv-record',
        description:
          'Generate Minecraft server SRV records for your DNS provider',
      },
      {
        name: 'CIDR Clash Checker',
        type: 'anchor',
        href: 'cidr-clash',
        description: 'Check if two CIDR ranges overlap',
      },
    ],
  },
];
