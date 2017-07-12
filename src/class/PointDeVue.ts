import {selectVideo} from "../functions";
import {CST} from "../const";

export class PointDeVue{
  video: HTMLVideoElement;
  audio: HTMLAudioElement;
  button: HTMLElement;
  delta: number =  1 / (.75 * CST.FPS);
  currentInterval: any;
  constructor(public tag, public depart: number, public fin: number, public color: string){
    this.video = <HTMLVideoElement> document.getElementById(tag);
    this.video.volume = 0;
    this.audio = document.createElement('audio');
    this.audio.src = 'assets/audio/bande_son_'  + tag + '.mp3';
    this.audio.volume = 0;
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

}