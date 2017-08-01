import {secondToFrame, selectVideo} from "../functions";
import {CST} from "../const";
import {LoaderService} from "./MediaLoader";
import {g} from "../globals";

export class PointDeVue{
  video: HTMLVideoElement;
  audio: HTMLAudioElement;
  button: HTMLElement;
  delta: number =  1 / (.75 * CST.FPS);
  currentInterval: any;
  src: string;
  constructor(public tag, public depart: number, public fin: number, public color: string){
    this.video = <HTMLVideoElement> document.getElementById(tag);
    this.video.volume = 0;
    this.video.src = "";
    console.log(this.video.currentSrc, this.src);
    this.video.load();
    this.audio = document.createElement('audio');
    this.audio.src = 'assets/audio/bande_son_'  + tag + '.mp3';
    this.audio.volume = 0;
    LoaderService.load(this.audio);
    this.button = document.getElementById(tag + "-bt");
    this.button.addEventListener('click', ()=>{selectVideo(this.tag)});
  }
  mute(){
    clearInterval(this.currentInterval);
    this.currentInterval = setInterval(()=>{
      this.audio.volume = Math.round(Math.max(0,this.audio.volume - this.delta * 1.25) * 100) / 100;
      if(this.audio.volume <= 0){
        this.audio.volume = 0;
        clearInterval(this.currentInterval);
      }
    }, CST.FPS);
  }
  unmute(){
    clearInterval(this.currentInterval);
    this.currentInterval = setInterval(()=>{
      this.audio.volume = Math.round(Math.min(1, this.audio.volume + this.delta) * 100) / 100;
      if(this.audio.volume >= 1){
        this.audio.volume = 1;
        clearInterval(this.currentInterval);
      }
    }, CST.FPS);
  }

  isReady(){
    return this.audio.readyState == 4 &&  this.video.readyState == 4;
  }

  getVideoBuffer(): Array<[number, number]>{
    let arr = [];
    let l = this.video.buffered.length;
    while(l--){
      arr.push([
        secondToFrame(this.video.buffered.start(l)),
        secondToFrame(this.video.buffered.end(l))
      ])
    }
    return arr;
  }

  load(){
    this.src = `./assets/videos/${g.resolution}p/${this.tag}.mp4`;
    console.log('loaded', this.src);
    this.video.src = this.src;
    console.log(this.src)
    this.video.load();
  }

  getAudioBuffer(): Array<[number, number]>{
    let arr = [];
    let l = this.audio.buffered.length;
    while(l--){
      arr.push([
        secondToFrame(this.audio.buffered.start(l)),
        secondToFrame(this.audio.buffered.end(l))
      ])
    }
    return arr;
  }

}