import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import WayfindingAppLink from '../components/WayfindingAppLink';
import { useCharges } from '../state/docket';
import { AppSearch } from './AppSearch';
import { MenuState} from './Nav';

const SECTIONS = {
  SELECTS: 'Tlon Selects',
  PALS: 'Powered by Pals',
  DEV: 'Develop on Urbit',
  USEFUL: 'Make Urbit Useful',
};

const APPS = [
  {
    title: 'pals',
    description: 'friendlist for peer discovery',
    color: '#99D3BD',
    link: '/apps/pals',
    source: '~paldev',
    section: SECTIONS.SELECTS,
    desk: 'pals',
  },
  {
    title: 'Terminal',
    description: "A web interface to your Urbit's command line",
    color: '#233D34',
    link: '/apps/webterm',
    section: SECTIONS.SELECTS,
    desk: 'webterm',
  },
  {
    title: 'face',
    description: 'see your friends',
    color: '#3B5998',
    link: '/apps/face',
    section: SECTIONS.PALS,
    desk: 'face',
  },
  {
    title: 'rumors',
    description: 'Anonymous gossip from friends of friends',
    color: '#BB77DD',
    link: '/apps/rumors',
    section: SECTIONS.PALS,
    desk: 'rumors',
  },
  {
    title: 'Contacts',
    description: 'Contact book',
    color: '#338899',
    link: '/apps/whom',
    section: SECTIONS.PALS,
    desk: 'whom',
  },
  {
    title: "sc'o're",
    description: "leaderboard for groups' ['o']s, as seen on tv!",
    color: '#FFFF00',
    link: '/apps/scooore',
    section: SECTIONS.PALS,
    desk: 'scooore',
  },
  {
    title: 'Docs',
    description: 'User and developer documentation for Urbit apps',
    color: '#FFCF00',
    link: '/apps/docs',
    section: SECTIONS.DEV,
    desk: 'docs',
  },
  {
    title: 'Quorum',
    description:
      'A choral explanations app (a la Stack Overflow or Quora) for Urbit',
    color: '#F2F2F2',
    link: '/apps/quorom',
    section: SECTIONS.DEV,
    desk: 'quorum',
    image: 'https://ladrut.xyz/quorum/quorum-logo.png',
  },
  {
    title: 'silo',
    description: 'An S3 storage manager',
    color: '#4F46E5',
    link: '/apps/silo',
    section: SECTIONS.USEFUL,
    desk: 'silo',
  },
  {
    title: 'hodl',
    description: 'A portfolio for all that you hodl',
    color: '#B8A3D1',
    link: '/apps/hodl',
    section: SECTIONS.USEFUL,
    desk: 'hodl',
    image:
      'https://user-images.githubusercontent.com/16504501/194947852-8802fd63-5954-4ce8-b147-2072bd929242.png',
  },
];

export default function GetApps() {
  const charges = useCharges();
  const { menu } = useParams<{ menu?: MenuState }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const menuState = menu || 'closed';
  const isOpen = menuState !== 'upgrading' && menuState !== 'closed';

  return (
    <div className="flex h-full flex-col space-y-8 overflow-y-scroll p-8">
      <h1 className="text-xl font-bold text-gray-800">Find Urbit Apps</h1>
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold text-gray-800">
          Find Urbit App Developers
        </h2>
        <AppSearch
          ref={inputRef}
          menu={menuState}
          dropdown="leap-items"
          navOpen={isOpen}
        />
      </div>
      {Object.entries(SECTIONS).map(([key, name]) => (
        <div key={key} className="flex flex-col space-y-2">
          <h2 className="text-lg font-bold text-gray-800">{name}</h2>
          <div className="flex flex-col space-y-2 px-2">
            {APPS.map((app) => {
              if (app.section === name) {
                return (
                  <WayfindingAppLink
                    key={app.desk}
                    title={
                      charges[app.desk] ? charges[app.desk].title : app.title
                    }
                    description={
                      charges[app.desk]
                        ? charges[app.desk]?.info ?? app.description
                        : app.description
                    }
                    color={
                      charges[app.desk] ? charges[app.desk].color : app.color
                    }
                    image={
                      charges[app.desk]
                        ? charges[app.desk].image
                        : app.image ?? ''
                    }
                    link={charges[app.desk] ? app.link : ''}
                    installed={charges[app.desk] ? true : false}
                  />
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
