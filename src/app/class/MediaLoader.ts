import {Media} from "../const";
import {getMediaBuffer, secondToFrame} from "../functions";

interface Resource {
  media: Media;
  loadState: number;
  buffered: boolean;
}


export class MediaLoader {
  private _resources: Array<Resource> = [];
  constructor(){

  }
  load(element: Media){
    element.load();
    element.volume = 0;
    element.play();
    element.playbackRate = 3;
    this._resources.push({
      media: element,
      loadState: 0,
      buffered: false
    })
  }
  update(){
    let buffer, duration, loadedPercent;
    for(let resource of this._resources){
      if(resource.loadState < 100){
        buffer = getMediaBuffer(resource.media);
        duration = secondToFrame(resource.media.duration);
        // console.log(buffer[0], duration)
        loadedPercent = buffer.reduce(function(loadedPercent, range, i, buffer){
          return loadedPercent + (range[1] - range[0]) * 100 /  duration;
        }, 0);
        resource.loadState = loadedPercent;
      }
      else {
        resource.media.pause();
        resource.media.currentTime = 0.00001;
        debugger
      }
    }
  }
  getResLength(){
    return this._resources.length;
  }
}


let LoaderService = new MediaLoader();

export {LoaderService}