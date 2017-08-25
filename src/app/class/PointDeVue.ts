import {findClosestRange, isPointDeVueAvailable, secondToFrame, selectVideo} from "../functions";
import {CST} from "../const";
import {LoaderService} from "./MediaLoader";
import {g} from "../globals";

export class PointDeVue{
  video: HTMLVideoElement;
  videoSource: MediaSource;
  sourceBuffer: SourceBuffer;
  audio: HTMLAudioElement;
  button: HTMLElement;
  delta: number =  1 / (.75 * CST.FPS);
  currentInterval: any;
  src: string;
  muted: boolean = true;
  buffer: Array<[number, number]> = [];
  constructor(public tag, public depart: number, public fin: number, public color: string){
    this.video = <HTMLVideoElement> document.getElementById(tag);
    this.video.volume = 0;
    this.audio = document.createElement('audio');
    this.audio.src = 'assets/audio/bande_son_'  + tag + '.mp3';
    this.audio.volume = 0;
    LoaderService.load(this.audio);
    this.button = document.getElementById(tag + "-bt");
    this.button.addEventListener('click', ()=>{selectVideo(this.tag)});

    //bindings
  }

  /*
    SOUND FUNCTIONS
   */
  mute(){
    this.muted = true;
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
    this.muted = false;
    clearInterval(this.currentInterval);
    this.currentInterval = setInterval(()=>{
      this.audio.volume = Math.round(Math.min(g.volume, this.audio.volume + this.delta) * 100) / 100;
      if(this.audio.volume >= g.volume){
        this.audio.volume = g.volume;
        clearInterval(this.currentInterval);
      }
    }, CST.FPS);
  }


  isReady(){
    // TODO: determine in audio.readystate is useful
    this.getVideoBuffer();
    let range = findClosestRange(this, g.currentFrame);
    let readyStateMin = g.isFirefox ? 3 : 4;
    let audioReady = (this.audio.readyState == readyStateMin || this.audio.currentTime === this.audio.duration);
    let videoReady = (this.audio.readyState == readyStateMin || this.video.currentTime === this.video.duration);
    let bool = this.fin < g.currentFrame ||( audioReady  && videoReady);
      // &&(!isPointDeVueAvailable(this, g.currentFrame)
      //   || (range  && range[1] > g.currentFrame - this.depart + CST.MIN_BUFFER_FRAMES)
    // );
    if(range){
      // console.log('advance frame is', (range[1] - (g.currentFrame - this.depart)), 'for', this.tag )
    }
    return bool;
  }

  updateVolume(value: number){
    if(!this.muted){
      this.audio.volume = value;
      // console.log(this.audio, LoaderService._resources);
    }
  }

  /*
    BUFFERS FUNCTIONS
   */
  getVideoBuffer(): Array<[number, number]>{
    this.buffer = [];
    let l = this.video.buffered.length;
    while(l--){
      this.buffer.push([
        secondToFrame(this.video.buffered.start(l)),
        secondToFrame(this.video.buffered.end(l))
      ])
    }
    return this.buffer;
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


  /*
    LOAD FUNCTIONS
   */

  load(){
    this.src = `./assets/videos/${g.resolution}/${this.tag}.mp4`;
    // this.src = `./assets/videos/1920/boucle_intro.mp4`;
    // if ('MediaSource' in window && MediaSource.isTypeSupported(CST.CODEC)) {
    //   this.videoSource = new MediaSource();
    //   this.video.src = URL.createObjectURL(this.videoSource);
    //   console.log('video src set');
    //   console.log('     ____PointDeVue LOAD START ', this.tag, '_______');
    //   this.videoSource.addEventListener('sourceopen', (e: MediaStreamEvent)=>{
    //     console.log('SOURCE IS OPENING FROM LISTENER', this.videoSource.readyState)
    //     this.sourceOpen(e)
    //   });
    // } else {
    //   console.error('Unsupported MIME type or codec: ', CST.CODEC);
    //   this.video.src = this.src;
    // }
    this.video.src = this.src;
    this.video.load();
  }

  /*
    OBSOLETE MEDIA SOURCE TESTS
   */
  sourceOpen(e: MediaStreamEvent){
    this.sourceBuffer = this.videoSource.addSourceBuffer(CST.CODEC);
    this.fetchStream(this.src, (buffer: ArrayBuffer)=>{
      this.sourceBuffer.addEventListener('updateend', (_)=>{
        // console.log(this.videoSource.readyState, 'at update end', this.getVideoBuffer(), this.video.readyState);
        // this.videoSource.endOfStream()
        // debugger;
      });
      this.sourceBuffer.appendBuffer(buffer);
      // console.log(this.getVideoBuffer(), this.video.readyState, buffer.byteLength)
    });
    // this.video.load()

  }

  fetchStream(url: string, cb){
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(res){
      cb(xhr.response);
    };
    xhr.send();
  }

  kill(){
    this.audio.pause();
    this.audio.src = "";
    this.audio.load();
    this.video.pause();
    this.video.src = "";
    // console.log('video kill lol')
    this.video.load();
  }
}