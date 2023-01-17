import { Bin } from '../useNotifications';

/* These vary slightly from reality, based on the completion of
  https://github.com/tloncorp/landscape-apps/issues/1717 */

export const dm: Bin = {
  time: 1672362060473,
  count: 45,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
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

      'Urbit Fan Club',
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

export const memberAdd: Bin = {
  time: 1673919345191,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v2.6l8dq.uk1fn.t43f9.6ssab.0lk9v',
    con: [
      {
        ship: '~zod',
      },
      ' has joined ',

      'Urbit Fan Club',
    ],
    wer: '/groups/~nec/urbit-fan-club/info/members',
    time: 1673919345191,
    rope: {
      channel: null,
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/urbit-fan-club/joins',
    },
  },
};

export const memberLeave: Bin = {
  time: 1673977904362,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v1.nfhs2.h9uh9.ml9ql.iblf0.f8joj',
    con: [
      {
        ship: '~zod',
      },
      ' has left ',
      'Urbit Fan Club',
    ],
    wer: '/groups/~nec/urbit-fan-club/info/members',
    time: 1673977904362,
    rope: {
      channel: null,
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/urbit-fan-club/leaves',
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
      'Urbit Fan Club',
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

export const channelDel: Bin = {
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
      ' has been removed from ',
      'Urbit Fan Club',
    ],
    wer: '/groups/~nec/urbit-fan-club/channels',
    time: 1673919375593,
    rope: {
      channel: null,
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/urbit-fan-club/channel/del',
    },
  },
};

export const channelRename: Bin = {
  time: 1673977440752,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v3.42s9d.a4iaj.lno6f.8gv23.t3a5l',
    con: [
      {
        emph: 'Chat Channel',
      },
      ' has been renamed to ',
      {
        emph: 'Chatter',
      },
    ],
    wer: '/groups/~nec/urbit-fan-club/channels',
    time: 1673977440752,
    rope: {
      channel: null,
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/urbit-fan-club/channel/edit',
    },
  },
};

export const channelEdit: Bin = {
  time: 1673977440752,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v3.42s9d.a4iaj.lno6f.8gv23.t3a5l',
    con: [
      {
        emph: 'Chat Channel',
      },
      ' has been edited',
    ],
    wer: '/groups/~nec/urbit-fan-club/channels',
    time: 1673977440752,
    rope: {
      channel: null,
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/urbit-fan-club/channel/edit',
    },
  },
};

export const noteCommentYours: Bin = {
  time: 1673979933955,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v23qko.kh5ef.65hvo.78c3b.6gmhs',
    con: [
      {
        ship: '~zod',
      },
      ' commented on ',
      {
        emph: 'A post from my ~nec of the woods',
      },
      ': ',
      {
        ship: '~zod',
      },
      ': ',
      'whoops',
    ],
    wer: '/groups/~nec/urbit-fan-club/channels/diary/~nec/notebook/note/170141184506031647169930034725624217600',
    time: 1673979933955,
    rope: {
      channel: 'diary/~nec/notebook',
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/notebook/note/170141184506031647169930034725624217600',
    },
  },
};

export const noteComment: Bin = {
  time: 1673980172289,
  count: 1,
  shipCount: 1,
  unread: true,
  topYarn: {
    but: null,
    id: '0v3.9vsav.g89e6.ca7j0.b6ogt.fjc4j',
    con: [
      {
        ship: '~zod',
      },
      ' commented on ',
      {
        emph: "Zod's Word",
      },
      ': ',
      {
        ship: '~zod',
      },
      ': ',
      'it really is',
    ],
    wer: '/groups/~nec/urbit-fan-club/channels/diary/~nec/notebook/note/170141184506031651210239864828889923584',
    time: 1673980172289,
    rope: {
      channel: 'diary/~nec/notebook',
      desk: 'groups',
      group: '~nec/urbit-fan-club',
      thread: '/~nec/notebook/note/170141184506031651210239864828889923584',
    },
  },
};
