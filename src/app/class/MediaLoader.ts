import {Media} from "../const";
import {getMediaBuffer, secondToFrame} from "../functions";

interface Resource {
  media: Media;
  loadState: number;
  buffered: boolean;
}


export class MediaLoader {
  private _loadCallbacks: Array<Function> = [];
  private _updateCallbacks: Array<Function> = [];
  private _resources: Array<Resource> = [];
  public globalLoad: number = 0;
  private _loadStart: number;
  constructor(){
    this.update = this.update.bind(this);
  }
  onUpdate(fn: Function){
    this._updateCallbacks.push(fn);
  }
  load(element: Media){
    if(!this._loadStart) this._loadStart = performance.now();
    element.load();
    element.volume = 0;
    element.play();
    element.playbackRate = 5  ;
    this._resources.push({
      media: element,
      loadState: 0,
      buffered: false
    })
  }
  update(){
    if(this._loadCallbacks.length > 0){
      let buffer, duration, loadedPercent, percentPlayed;
      let globalLoad = 0;
      for(let resource of this._resources){
        globalLoad += resource.loadState;
        if(resource.loadState < 100 && resource.media.duration){
          buffer = getMediaBuffer(resource.media);
          duration = secondToFrame(resource.media.duration);
          loadedPercent = buffer.reduce(function(loadedPercent, range, i, buffer){
            return loadedPercent + (range[1] - range[0]) * 100 /  duration;
          }, 0);
          percentPlayed = secondToFrame(resource.media.currentTime) * 100 / duration;
          let pbr = 5;
          if(loadedPercent - percentPlayed > 20){
            resource.media.currentTime = resource.media.duration * (loadedPercent - 0.1) / 100;
          }
          resource.media.playbackRate = !isNaN(pbr) ? pbr : 5;
          resource.loadState = loadedPercent;
          // console.log(resource.media.src, loadedPercent, percentPlayed);
          // console.log('paused:', resource.media.paused, percentPlayed, 'pbr:', pbr, resource.media.src, loadedPercent);
        }
        else if(resource.media.duration) {
          if(!resource.buffered){
            resource.media.pause();
            resource.buffered = true;
            resource.media.currentTime = 0.00001;
          }
        }
      }
      if(globalLoad >= this._resources.length * 100){
        this._loadCallbacks.forEach((callback, index)=>{
          callback(performance.now() - this._loadStart);
          this._loadCallbacks.splice(0 ,1);
        });
      }
      this._updateCallbacks.forEach((cb)=>{
        console.log('sending update at', globalLoad / this.getResLength())
        cb(globalLoad / this.getResLength());
      })
    }
    window.requestAnimationFrame(this.update);
  }
  // on load callback will send back the time it took to load in ms
  onLoad(fn : Function){
    this._loadCallbacks.push(fn);
  }
  getResLength(){
    return this._resources.length;
  }
}


let LoaderService = new MediaLoader();

export {LoaderService}