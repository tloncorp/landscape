import { Passport } from "@/gear";

const fakePassport: Passport = {
  rad: [],
  sys: [
    {
      kind: {
        nom: 'Access your network keys',
        pes: [
          {
            desc: 'Read or change your network keys',
            warn: 'This permission is required for the app to work properly',
            pers: [],
            have: 'nil',
          }
        ]
      }
    },
  ],
  any: [
    {
      kind: {
        nom: 'Send Notifications',
        pes: [
          {
            desc: 'Receive notifications via Hark',
            have: "nil",
            warn: null,
            pers: []
          }
        ]
      }
    }
  ],
  new: [
    {
      kind: {
        nom: 'Manage system utilities and data',
        pes: [
          {
            desc: 'Update your Landscape and Urbit settings',
            have: "nil",
            warn: null,
            pers: []
          }
        ]
      }
    },
  ],
  app: [],
};


const fakeSeal = `:-  %0
:~
  ::  %bait
  ::
  [%eyre %serve]
  [%write & %reel]
  ::  %docket
  ::
  [%clay %pulse ~]
  [%eyre %serve]
  [%behn %timer]
  [%write | %hood]
  [%reads %g %x %treaty /treaty]
  [%reads %c %x %$ /tire]
  [%watch | %spider /thread-result]
  [%write | %spider]
  [%clay %local %z ~ /desk/docket-0]
  [%clay %write ~ /desk/docket-0]
  [%reads %c %w ~ /]
  [%reads %c %u ~ /desk/docket-0]
  [%reads %c %x ~ /desk/docket-0]
  ::  %hark-store
  ::
  [%write | %hark-graph-hook]
  ::  %hark-system-hook
  ::
  [%write | %hark-store]
  [%clay %local %z ~ /]
  [%behn %timer]
  [%reads %c %x %$ /tire]
  [%reads %c %u ~ /desk/docket-0]
  [%reads %c %x ~ /desk/docket-0]
  [%reads %c %z ~ /]
  [%reads %c %w ~ /]
  ::  %reel
  ::
  [%khan %tread]
  [%write & %bait]
  [%write & %reel]
  ::  %settings
  ::
  [%reads %g %u %settings-store /]
  [%reads %g %x %settings-store /all]
  ::  %settings-store
  ::
  ::  (none)
  ::
  ::  %storage
  [%reads %g %u %s3-store /]
  [%reads %g %x %s3-store /credentials]
  [%reads %g %x %s3-store /configuration]
  ::
  ::  %treaty
  [%reads %c %w ~ /desk/docket]
  [%reads %c %z ~ /]
  [%watch & %treaty /alliance]
  [%watch & %treaty /treaty]
  [%watch | %docket /dockets]
  [%reads %x %x ~ /desk/docket-0]
  [%clay %local %x ~ /desk/docket-0]
  [%write | %hood]
==
`;

export { fakePassport, fakeSeal };
