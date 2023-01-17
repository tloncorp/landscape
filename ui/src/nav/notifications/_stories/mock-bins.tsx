import { Bin } from '../useNotifications';

export const dm: Bin = {
  time: 1672362060473,
  count: 45,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: { title: 'Reply', handler: '' },
    id: '0v1.45pi5.aakuh.q0cb0.gd6fq.oks1p',
    con: [
      {
        ship: '~rapfyr-diglyt',
      },
      ': ',
      'send me a message there when you get this too just to make sure it works',
      '',
    ],
    wer: '/dm/~rapfyr-diglyt',
    time: 1672362060473,
    rope: {
      channel: null,
      desk: 'talk',
      group: null,
      thread: '/dm/~rapfyr-diglyt',
    },
  },
};

export const dmInvite: Bin = {
  time: 1673918159896,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v7.r8ue5.tkh9o.eqba8.pqqru.hcj5t',
    con: [
      {
        ship: '~nec',
      },
      ' has invited you to a direct message: “',
      'hello',
      '”',
    ],
    wer: '/dm/~nec',
    time: 1673918159896,
    rope: {
      channel: null,
      desk: 'talk',
      group: null,
      thread: '/dm/~nec',
    },
  },
};

export const groupInvite: Bin = {
  time: 1673918920627,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v6.n2muc.h88j8.i48ft.6tdk9.p05tj',
    con: [
      {
        ship: '~nec',
      },
      ' sent you an invite to ',
      {
        emph: 'Urbit Fan Club',
      },
    ],
    wer: '/find',
    time: 1673918920627,
    rope: {
      channel: null,
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/urbit-fan-club/invite',
    },
  },
};

export const reply: Bin = {
  time: 1672362060473,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: { title: '', handler: '' },
    id: '0v1.45pi5.aakuh.q0cb0.gd6fq.oks1p',
    con: [
      {
        ship: '~dev',
      },
      ' replied to your message ',
      '“check”: ',
      'seen',
    ],
    wer: '/dm/~dev',
    time: 1672362060473,
    rope: {
      channel: '',
      desk: 'groups',
      group: '~zod/test',
      thread: '/groups/~zod/test',
    },
  },
};

export const channelAdd: Bin = {
  time: 1673919375593,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v2.odguc.n4ii0.0o42m.13e4s.bjojl',
    con: [
      {
        emph: 'Chat Channel',
      },
      ' has been added to ',
      {
        emph: 'Urbit Fan Club',
      },
    ],
    wer: '/groups/~nec/urbit-fan-club/channels',
    time: 1673919375593,
    rope: {
      channel: null,
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/urbit-fan-club/channel/add',
    },
  },
};
