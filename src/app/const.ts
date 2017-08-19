export const CST = {
  DEBUG: true,
  // DEBUG: process.env.DEBUG,
  FULL_END: 6585,
  MIN_BUFFER_FRAMES: 20,
  TIMER_SHOW_DISTANCE: 34,
  OVERLAY_DATA: {
    LIST: [{
      start: 150,
      end: 400,
      template: 'tuto'
    }]
  },
  FILM_DATA: {
    DEPART: 0,
    FIN: 7671,
    FRAMERATE: 25,
    TIMELINE:[
      0,
      432,
      507,
      885,
      1080,
      1247,
      1363,
      1482,
      1623,
      1739,
      1825,
      1980,
      2127,
      2349,
      2599,
      2787,
      2975,
      3204,
      3421, /* to check after export */
      3590,
      3715,
      4054,
      4294,
      4893,
      4983, /* check mon frere */
      5170, /* check sa soeur */
      5507 /* fini a 5 ? */
    ]
  },
  POINTS_DE_VUE:[
    {
      name: "spectateur",
      depart:0,
      fin: 7671,
      color: 'turquoise'
    },
    {
      name: "emma",
      depart: 517,
      fin: 4294,
      color: 'yellow'
    },
    {
      name: "solvej",
      depart: 1248,
      fin: 5506,
      color: 'red'
    }
  ],
  VIDEO_RATIO: 2200 / 1080,
  SNAP_DELTA_FRAME_BEFORE: 12,
  SNAP_DELTA_FRAME_AFTER: 12,
  SOUND_TRANSITION_FRAME: 6,
  INTERVAL: null,
  FPS: null
};

CST.FPS = CST.FILM_DATA.FRAMERATE;

CST.INTERVAL = 1000 / CST.FILM_DATA.FRAMERATE;



export type Media = HTMLVideoElement | HTMLAudioElement;