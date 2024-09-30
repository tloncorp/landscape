export const storageVersion = parseInt(
  import.meta.env.VITE_STORAGE_VERSION,
  10
);

export const SECTIONS = {
  ESSENTIALS: 'Essentials',
  SOCIAL: 'Social',
  MEDIA: 'Media',
  UTILITIES: 'Utilities',
  FUN: 'Fun'
};

export const APPS = [
  // ESSENTIALS
  {
    title: 'Tlon',
    description: 'Start, host, and cultivate communities.',
    color: '#EFF0F4',
    link: '/apps/groups',
    source: '~sogryp-dister-dozzod-dozzod',
    section: SECTIONS.ESSENTIALS,
    desk: 'groups',
    image: 'https://bootstrap.urbit.org/tlon.svg?v=1'
  },
  {
    title: 'Pals',
    description: 'Friendlist for peer discovery.',
    color: '#99D3BD',
    link: '/pals',
    source: '~paldev',
    section: SECTIONS.ESSENTIALS,
    desk: 'pals'
  },
  {
    title: 'Terminal',
    description: 'A web interface to your Urbit\'s command line.',
    color: '#2E4347',
    link: '/apps/webterm',
    source: '~mister-dister-dozzod-dozzod',
    section: SECTIONS.ESSENTIALS,
    desk: 'webterm'
  },
  // SOCIAL
  {
    title: 'Rumors',
    description: 'Anonymous gossip from friends of friends.',
    color: '#BB77DD',
    link: '/rumors',
    source: '~paldev',
    section: SECTIONS.SOCIAL,
    desk: 'rumors'
  },
  {
    title: 'Radio',
    description: 'An app for urbit disc jockeys.',
    color: '#FFFFFF',
    link: '/apps/radio',
    section: SECTIONS.SOCIAL,
    desk: 'radio',
    source: '~nodmyn-dosrux',
    image: 'https://bwyl.nyc3.digitaloceanspaces.com/radio/radio.png'
  },
  {
    title: 'Trill',
    description: 'Twitter without limits, and much more.',
    color: '#FFD400',
    link: '/apps/trill',
    section: SECTIONS.SOCIAL,
    desk: 'trill',
    source: '~dister-dozzod-sortug',
    image: 'https://s3.sortug.com/img/trill-logo.png'
  },
  // MEDIA
  {
    title: 'Common Blog',
    description: 'Self-hosted writing and publishing.',
    color: '#EFF0F4',
    link: '/apps/blog',
    section: SECTIONS.MEDIA,
    desk: 'blog',
    source: '~dister-bonbud-macryg',
    image: 'https://raw.githubusercontent.com/thecommons-urbit/blog/main/assets/tile.png'
  },
  {
    title: "Feeds",
    description: "Aggregate, discover, and publish web feeds.",
    color: "#CCCCCC",
    link: "/feeds/~/recent",
    source: '~dister-migrev-dolseg',
    section: SECTIONS.MEDIA,
    desk: 'feeds',
    image: 'https://nyc3.digitaloceanspaces.com/drain/2023.12.13..02.46.56-feeds.png'
  },
  {
    title: 'Scratch',
    description: 'For writing and sharing bits of text.',
    color: '#50AAEC',
    link: '/scratch',
    source: '~dister-nocsyx-lassul',
    section: SECTIONS.MEDIA,
    desk: 'scratch',
    image: 'https://nyc3.digitaloceanspaces.com/hmillerdev/nocsyx-lassul/2023.6.11..05.43.03-scratch.svg'
  },
  // UTILITIES
  {
    title: "Eyas",
    description: "Text editor.",
    color: '#7F5AB6',
    link: '/eyas',
    source: '~dister-migrev-dolseg',
    section: SECTIONS.UTILITIES,
    desk: 'eyas',
    image: 'https://nyc3.digitaloceanspaces.com/drain/2023.10.29..09.56.09-eyas-icon.png'
  },
  {
    title: 'Albums',
    description: 'A photo sharing app.',
    color: '#9AACBD',
    link: '/apps/albums',
    source: '~topdem',
    section: SECTIONS.UTILITIES,
    desk: 'albums',
    image: 'https://files.native.computer/albums/albums.svg'
  },
  {
    title: 'Hits',
    description: 'A leaderboard for app installs.',
    color: '#1E1414',
    link: '/apps/hits',
    source: '~bitdeg',
    section: SECTIONS.UTILITIES,
    desk: 'hits',
    image: 'https://storage.googleapis.com/media.urbit.org/apps/%25hits-logo.png',
  },
  // FUN
  {
    title: 'Turf',
    description: 'Build a world with your friends, explore, and hang out.',
    color: '#1F843C',
    link:'/apps/turf',
    source: '~pandux',
    section: SECTIONS.FUN,
    desk: 'turf',
    image: 'https://raw.githubusercontent.com/johnhyde/turf/main/public/logo-big.png'
  },
  {
    title: 'Board',
    description: 'A tapestry of boards.',
    color: '#9E34EB',
    link: '/apps/board',
    source: '~ridlyd',
    section: SECTIONS.FUN,
    desk: 'board'
  },
  {
    title: 'Hydra',
    description: 'Make it spin.',
    color: '#D3D3D3',
    link: '/apps/hydra',
    source: '~tolmud-tobtud',
    section: SECTIONS.FUN,
    desk: 'hydra',
    image: 'https://s3.tolmud-tobtud.startram.io/bucket/tolmud-tobtud/2023.12.01..16.41.53-Screenshot%202023-12-01%20at%2011.17.04.png'
  }
];
