import {CST} from "./const";
import {DebugElement} from "./class/debugElement";
import {PointDeVue} from "./class/PointDeVue";

export let g:{
  debugElements: Array<DebugElement>;
  pointDeVue: {[s:string]: PointDeVue};
  audio: {
    voix: HTMLAudioElement
  },
  resolution: number,
  state: {
    isPlaying: boolean,
    isLoading: boolean,
    isAudioLoaded: boolean,
    isWaiting: boolean,
    isBuffering: boolean,
    bufferedPOV: any,
  },
  currentVideo: string;
  nextVideo: string;
  currentFrame: number;
  previousFrame: number;
  nextShotFrame: number;
  currentTimestamp: number;
  deltaTimestamp: number;
  volumeDelta: number;
  filmTimestamp: number;
  nextInterval: number;
  frameLoop: number;
  mouse: {
    x: number,
    y: number
  }
} = {
  debugElements:[],
  pointDeVue: {},
  resolution: 1920,
  audio: {
    voix: null
  },
  state: {
    isPlaying: false,
    isLoading: false,
    isWaiting: false,
    isAudioLoaded: false,
    isBuffering: false,
    bufferedPOV: null
  },
  currentVideo: null,
  nextVideo: null,
  currentFrame: 0,
  previousFrame: 0,
  nextShotFrame: 0,
  currentTimestamp: 0,
  deltaTimestamp: 0,
  volumeDelta: 0,
  filmTimestamp: 0,
  nextInterval: 0,
  frameLoop: 0,
  mouse: {
    x: 0,
    y: 0,
  }
};
