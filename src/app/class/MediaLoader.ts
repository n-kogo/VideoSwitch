import {Media} from "../const";
import {getMediaBuffer, secondToFrame} from "../functions";

interface Resource {
  media: Media;
  loadState: number;
  buffered: boolean;
  url: string;
  request: XMLHttpRequest;
}


export class MediaLoader {
  private _loadCallbacks: Array<Function> = [];
  private _updateCallbacks: Array<Function> = [];
  _resources: Array<Resource> = [];
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
    let url = element.src;
    element.src = null;
    console.log('load element with url:', url);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    let resource = {
      media: element,
      loadState: 0,
      url: url,
      buffered: false,
      request: xhr
    };
    xhr.onprogress = (data)=>{
      this.update(resource, data)
    };
    xhr.onload = (data)=>{
      this.loaded(resource, data)
    };
    xhr.send();
    this._resources.push(resource)
  }
  update(resource: Resource, data){
    /*
      XHR TECHNIQUE
    */
    // console.log('xhr update', resource.url, data);
    resource.loadState = data.loaded * 100 / data.total;
    let globalLoad = 0;
    this._resources.forEach((resource)=>{
      globalLoad += resource.loadState;
    });
    this._updateCallbacks.forEach((cb)=>{
      // console.log('sending update at', globalLoad / this.getResLength())
      cb(globalLoad / this.getResLength());
    });

    /*
      PLAY MEDIA TECHNIQUE
     */
    // let buffer, duration, loadedPercent, percentPlayed;
    // let globalLoad = 0;
    // for(let resource of this._resources){
    //   globalLoad += resource.loadState;
    //   if(resource.loadState < 99.9 && resource.media.duration){
    //     buffer = getMediaBuffer(resource.media);
    //     duration = secondToFrame(resource.media.duration);
    //     loadedPercent = buffer.reduce(function(loadedPercent, range, i, buffer){
    //       return loadedPercent + (range[1] - range[0]) * 100 /  duration;
    //     }, 0);
    //     percentPlayed = secondToFrame(resource.media.currentTime) * 100 / duration;
    //     if(loadedPercent - percentPlayed > 20){
    //       resource.media.currentTime = resource.media.duration * (loadedPercent - 0.1) / 100;
    //       // console.log('moved audio Load POV 20% up')
    //     }
    //     // else {
    //     //   console.log(percentPlayed, loadedPercent, resource.media.src)
    //     // }
    //     resource.media.playbackRate = 4;
    //     resource.loadState = loadedPercent;
    //     // console.log(resource.media.src, loadedPercent, percentPlayed);
    //     // console.log('paused:', resource.media.paused, percentPlayed, 'pbr:', pbr, resource.media.src, loadedPercent);
    //   }
    //   else if(resource.media.duration) {
    //     if(!resource.buffered){
    //       resource.media.pause();
    //       resource.buffered = true;
    //       resource.media.playbackRate = 1;
    //       resource.media.currentTime = 0.00001;
    //     }
    //   }
    // }
    // if(globalLoad >= this._resources.length * 99.9){
    //   this._loadCallbacks.forEach((callback, index)=>{
    //     callback(performance.now() - this._loadStart);
    //     this._loadCallbacks.splice(0 ,1);
    //   });
    // }
    // this._updateCallbacks.forEach((cb)=>{
    //   // console.log('sending update at', globalLoad / this.getResLength())
    //   cb(globalLoad / this.getResLength());
    // });
    // window.requestAnimationFrame(this.update);
  }

  loaded(resource: Resource, data){
    // console.info('resource loaded', resource.url, data);
    let globalLoad = 0;
    resource.loadState = data.loaded * 100 / data.total;
    this._resources.forEach((resource)=>{
      globalLoad += resource.loadState;
    });
    this._updateCallbacks.forEach((cb)=>{
      // console.log('sending update at', globalLoad / this.getResLength())
      cb(globalLoad / this.getResLength());
    });

    let type = 'audio/mpeg';
    let blob = new Blob([data.target.response], {
      type: type
    });
    //TODO: htmlvidoeelement has no "type" value...
    // resource.media.type = type;
    resource.media.src = URL.createObjectURL(blob);
    if(globalLoad >= this._resources.length * 99.9){
        this._loadCallbacks.forEach((callback, index)=>{
          callback(performance.now() - this._loadStart);
          this._loadCallbacks.splice(0 ,1);
        });
      }
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