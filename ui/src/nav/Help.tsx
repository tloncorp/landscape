import React from 'react';
import { Button } from '../components/Button';
import { GroupLink } from '../components/GroupLink';

interface Group {
  title: string;
  icon: string;
  color: string;
  link: string;
}

const groups: Record<string, Group> = {
  uc: {
    title: 'Urbit Community',
    icon: 'https://fabled-faster.nyc3.digitaloceanspaces.com/fabled-faster/2021.4.02..21.52.41-UC.png',
    color: 'bg-black',
    link: '/apps/groups/groups/~bitbet-bolbel/urbit-community',
  },
  discovery: {
    title: 'Group Discovery',
    icon: 'https://urbit.me/images/icons/icon-512x512.png',
    color: 'bg-green-300',
    link: '/apps/groups/groups/~rondev/group-discovery',
  },
  foundation: {
    title: 'Urbit Foundation',
    icon: 'https://interstellar.nyc3.digitaloceanspaces.com/battus-datsun/2022.11.07..19.39.22-Sig.png',
    color: 'bg-black',
    link: '/apps/groups/groups/~halbex-palheb/uf-public',
  },
  forge: {
    title: 'The Forge',
    icon: 'https://nyc3.digitaloceanspaces.com/archiv/littel-wolfur/2021.5.06..21.01.58-the%20forge.png',
    color: 'bg-black',
    link: '/apps/groups/groups/~middev/the-forge',
  },
  tlonSupport: {
    title: 'Tlon Support Forum',
    icon: 'https://sfo3.digitaloceanspaces.com/zurbit-images/dovsem-bornyl/2022.12.14..20.02.15-tlonstarpng.png',
    color: 'bg-yellow-500',
    link: '/apps/groups/groups/~bitpyx-dildus/tlon-support',
  },
  tlonPublic: {
    title: 'Tlon Public',
    icon: 'https://sfo3.digitaloceanspaces.com/zurbit-images/dovsem-bornyl/2022.6.16..19.11.20-flooring.jpeg',
    color: 'bg-yellow-500',
    link: '/apps/groups/groups/~nibset-napwyn/tlon',
  },
};

const Wayfinding = ({ tlonCustomer }: { tlonCustomer: boolean }) => (
  <div className="inner-section space-y-8">
    <span className="text-lg font-bold">
      Urbit{!tlonCustomer ? ' Support & ' : null} Wayfinding
    </span>
    <div className="flex flex-col space-y-2">
      <p className="leading-5">
        A community of Urbit enthusiasts, developers, and various Urbit-building
        organizations are on the network to guide you.
      </p>
      <p className="leading-5">
        For direct assistance with any urbit-related issues, bugs, or unexpected
        behavior, please contact{' '}
        <a href="mailto:support@urbit.org" className="font-bold">
          support@urbit.org
        </a>
        .
      </p>
      <p className="leading-5">
        If you need help getting situated on the network, or figuring out what
        fun things you can do with your urbit, join the following groups:
      </p>
    </div>
    <div className="flex flex-col space-y-2">
      <GroupLink
        title={groups.uc.title}
        icon={groups.uc.icon}
        color={groups.uc.color}
        link={groups.uc.link}
      />
      <GroupLink
        title={groups.tlonPublic.title}
        icon={groups.tlonPublic.icon}
        color={groups.tlonPublic.color}
        link={groups.tlonPublic.link}
      />
    </div>
    <p className="leading-5">
      If you are a developer and want to learn more about building applications
      for Urbit, check out these groups:
    </p>
    <div className="flex flex-col space-y-2">
      <GroupLink
        title={groups.forge.title}
        icon={groups.forge.icon}
        color={groups.forge.color}
        link={groups.forge.link}
      />
      <GroupLink
        title={groups.foundation.title}
        icon={groups.foundation.icon}
        color={groups.foundation.color}
        link={groups.foundation.link}
      />
    </div>
  </div>
);

export const Help = () => {
  const tlonCustomer = !window.URL.toString().indexOf('tlon.network');
  return (
    <div className="flex flex-col space-y-4">
      <div className="inner-section space-y-8 bg-gray-50 mix-blend-multiply dark:mix-blend-screen">
        <span className="text-lg font-bold">Submit Feedback</span>
        <p className="leading-5">
          Notice a bug? Have a suggestion? Want a feature? Use the button below
          to submit feedback directly to Tlon’s product development team.
        </p>
        <Button
          variant="alt-primary"
          as="a"
          href="https://airtable.com/shrflFkf5UyDFKhmW"
          target="_blank"
        >
          Submit Feedback
        </Button>
      </div>
      {tlonCustomer ? (
        <div className="inner-section space-y-8">
          <span className="text-lg font-bold">Tlon Customer Support</span>
          <p className="leading-5">
            As a customer of Tlon, you’re able to receive 24/7 support from the{' '}
            <span className="font-bold">Tlon Support Forum</span>, or you can
            email us at{' '}
            <a href="mailto:support@tlon.io" className="font-bold">
              support@tlon.io
            </a>
            .
          </p>
          <GroupLink
            title={groups.tlonSupport.title}
            icon={groups.tlonSupport.icon}
            color={groups.tlonSupport.color}
            link={groups.tlonSupport.link}
          />
        </div>
      ) : null}
      <Wayfinding tlonCustomer={tlonCustomer} />
    </div>
  );
};
