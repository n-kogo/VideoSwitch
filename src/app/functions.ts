import {g} from './globals'
import {CST, Media} from './const'
import {DebugElement} from "./class/debugElement";
import {PointDeVue} from "./class/PointDeVue";
import {LoaderService} from "./class/MediaLoader";

let timerBarBloc,
  timerBarBufferBloc,
  timerBarContainerBloc,
  timerCanvas : HTMLCanvasElement;

export function cacheDomElements(){
  timerBarBloc = document.getElementById('timer-bar');
  timerBarBufferBloc = document.getElementById('timer-bar-buffer')
  timerBarContainerBloc = document.getElementById('timer-bar-container');
  timerCanvas = <HTMLCanvasElement> document.getElementById('timer-background');
}

export function getMediaBuffer(media: Media): Array<[number, number]>{
  let arr = [];
  let l = media.buffered.length;
  while(l--){
    arr.push([
      secondToFrame(media.buffered.start(l)),
      secondToFrame(media.buffered.end(l))
    ])
  }
  return arr;
}


export function frameToSecond(frame){
 	return frame / CST.FPS;
}

export function secondToFrame(seconds){
  return Math.round(seconds * CST.FPS);
}

export function getRelativeFrame(pdv, frame){
  let nb = frame - pdv.depart;
  return nb;
}

export function getAbsoluteFrame(pdv, key?: string){
  let nb;
  if (key === 'audio'){
    nb = secondToFrame(pdv.audio.currentTime) + pdv.depart;
  }
  else {
    nb = secondToFrame(pdv.video.currentTime) + pdv.depart;
  }
  return nb;
}

export function isPointDeVueAvailable(pdv: PointDeVue, frame: number){
  return (pdv.depart <= frame && pdv.fin >= frame );
}

export function resize(){
  let width, height, mtop, mleft;
  let videos = document.getElementsByTagName('video');
  if(window.innerWidth / CST.VIDEO_RATIO <= window.innerHeight){
    width = window.innerWidth;
    height = window.innerWidth / CST.VIDEO_RATIO;
    mtop = (window.innerHeight - height) / 2;
    mleft = 0;
  }
  else {
    width = window.innerHeight * CST.VIDEO_RATIO;
    height = window.innerHeight;
    mtop = 0;
    mleft = (window.innerWidth - width) / 2;
  }
  if(CST.DEBUG){
    for(let i = 0; i < videos.length; i++){
      videos[i].setAttribute('width', (width / 3).toFixed(0));
      videos[i].setAttribute('height', (height / 3).toFixed(0));
      videos[i].style.top = mtop + "px";
      videos[i].style.left = (width * (i) + mleft) / 3 + "px";
    }
  }
  else {
    for(let i = 0; i < videos.length; i++){
      videos[i].setAttribute('width', width);
      videos[i].setAttribute('height', height);
      videos[i].style.top = mtop + "px";
      videos[i].style.left = mleft + "px";
    }
  }
}

export function setResolution(loadTime: number){
  let w = window.innerWidth;
  let r = 0;
  if(w <= 900){
    r = 853;
  }
  else if (w <= 1700){
    r = 1280
  }
  else {
    r = 1920
  }

  if(loadTime > 1000){
    r = Math.min(r, 1280)
  }
  else if (loadTime > 3000){
    r = Math.min(r, 853)
  }
  g.resolution = r;
}

// load new video
export function selectVideo(newVideoName: string, forced?: boolean){
  if (newVideoName in g.pointDeVue
      && isPointDeVueAvailable(g.pointDeVue[newVideoName], g.currentFrame)
      && (
          !g.currentVideo
          || (
              g.currentVideo
              && (newVideoName !== g.currentVideo || forced)
          )
      )
  ){
    g.nextVideo = newVideoName;
    g.pointDeVue[g.nextVideo].button.classList.add('loading');
    let closeFrame = findClosestShotFrame(g.currentFrame);
    if(closeFrame && closeFrame > g.currentFrame){
      g.nextShotFrame = closeFrame;
    }
    g.state.isLoading = true;
  }
}

//once loaded make the video start
export function playVideo(){
  if(g.currentVideo !== null){
    if(g.pointDeVue[g.currentVideo].video.paused && g.state.isPlaying)
      g.pointDeVue[g.currentVideo].video.play();
    g.pointDeVue[g.currentVideo].video.classList.remove('active');
    g.pointDeVue[g.currentVideo].button.classList.remove('active');
    g.pointDeVue[g.currentVideo].mute();
  }
  document.getElementById('loading-container').classList.add('hide');
  g.pointDeVue[g.nextVideo].video.classList.add('active');
  g.pointDeVue[g.nextVideo].button.classList.add('active');
  g.pointDeVue[g.nextVideo].button.classList.remove('loading');
  g.pointDeVue[g.nextVideo].unmute();
  timerBarBloc.style.backgroundColor = g.pointDeVue[g.nextVideo].color;
  g.currentVideo = g.nextVideo;
  g.nextVideo = null;
  g.nextShotFrame = null;
  g.state.isWaiting = false;
  if(g.state.isPlaying){
    if (g.audio.voix.paused) g.audio.voix.play();
    for(let key in g.pointDeVue){
      if(isPointDeVueAvailable(g.pointDeVue[key], g.currentFrame)){
        g.pointDeVue[key].video.play();
        g.pointDeVue[key].audio.play();
      }
    }
  }
  g.state.isLoading = false;
}

export function moveVideoTimer(frame){
  g.state.isWaiting = true;
  if (!g.audio.voix.paused) g.audio.voix.pause();
  g.audio.voix.currentTime = Math.min(CST.FILM_DATA.FIN, Math.max(0, frameToSecond(frame)));
  let currPdv;
  for (let key in g.pointDeVue){
    currPdv = g.pointDeVue[key];
    currPdv.video.pause();
    currPdv.audio.pause();
    currPdv.video.currentTime = "" + Math.min(currPdv.fin, Math.max(0, frameToSecond(frame -  currPdv.depart))) + "";
    currPdv.audio.currentTime = Math.min(currPdv.fin, Math.max(0, frameToSecond(frame - currPdv.depart)));
  }
  g.filmTimestamp = frameToSecond(frame) * 1000;
  g.currentFrame = frame;
  g.previousFrame = frame - 1;
  g.state.isLoading = true;
}

export function findClosestShotFrame(frame){
  let closeFrame = null;
  CST.FILM_DATA.TIMELINE.forEach(function(shotFrame){
    if(frame >= shotFrame - CST.SNAP_DELTA_FRAME_BEFORE && frame <= shotFrame  + CST.SNAP_DELTA_FRAME_AFTER){
      closeFrame = shotFrame
    }
  });
  return closeFrame;
}

export function drawDebugTimeline(){
  let bloc, percent;
  CST.FILM_DATA.TIMELINE.forEach(function(shotFrame){
    bloc = document.createElement('div');
    bloc.classList.add('timer-bar-frame');
    percent = shotFrame * 100 / CST.FILM_DATA.FIN;
    bloc.style.left = percent + '%';
    timerBarContainerBloc.appendChild(bloc);
  });
}

export function toggleVideo(){
  g.state.isPlaying = !g.state.isPlaying;
  if(g.state.isPlaying){
    if (g.audio.voix.paused) g.audio.voix.play();
  }
  else {
    g.audio.voix.pause();
  }
  for(let key in g.pointDeVue){
    if(g.state.isPlaying && isPointDeVueAvailable(g.pointDeVue[key], g.currentFrame)){
      g.pointDeVue[key].video.play();
      g.pointDeVue[key].audio.play();
    }
    else {
      g.pointDeVue[key].video.pause();
      g.pointDeVue[key].audio.pause();
    }
  }
  document.getElementById('pause-overlay').classList.toggle('hide');
}

export function spawnPointDeVue(data){
  g.pointDeVue[data.name] = new PointDeVue(data.name, data.depart, data.fin, data.color);
}

export function launchTimerEvents(){
  timerBarContainerBloc.addEventListener('click', function(e){
    let x = e.clientX - e.currentTarget.clientLeft;
    let percent = x / e.currentTarget.clientWidth;
    let newFrame = CST.FILM_DATA.FIN * percent;
    if(!isPointDeVueAvailable(g.pointDeVue[g.currentVideo], newFrame)){
      selectVideo('spectateur', true);
    }
    else {
      selectVideo(g.currentVideo, true);
    }
    moveVideoTimer(newFrame);
  });
}

export function updateTimerBar(){
  let timerContainer = document.getElementById('timer-bar-container');
  if(window.innerHeight - g.mouse.y < CST.TIMER_SHOW_DISTANCE && !timerContainer.classList.contains('show'))
    timerContainer.classList.add('show');
  else if ((window.innerHeight - g.mouse.y >= CST.TIMER_SHOW_DISTANCE && timerContainer.classList.contains('show')))
    timerContainer.classList.remove('show');
  timerBarBloc.style.width = (g.currentFrame * 100 / CST.FILM_DATA.FIN) + '%';
  timerBarBloc.style.borderRightWidth = window.innerWidth - timerBarBloc.offsetWidth + 'px';

}

let fillStyles = {
  emma: "rgba(200, 200, 0, .9)",
  spectateur: "rgba(20, 200, 200, .9)",
  solvej: "rgba(250, 10, 10, .9)"
};

let max, maxIndex;
export function indexOfMaxCollection(arr: Array<any>, key: string){
  if (arr.length === 0) {
    return -1;
  }

  max = arr[0][key];
  maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i][key] > max) {
      maxIndex = i;
      max = arr[i][key];
    }
  }

  return maxIndex;
}

export function maxOfCollection(arr: Array<any>, key: string){
  if (arr.length === 0) {
    return -1;
  }

  max = arr[0][key];

  for (var i = 1; i < arr.length; i++) {
    if (arr[i][key] > max) {
      max = arr[i][key];
    }
  }

  return max;

}

export function findClosestRange(selectedRange: Array<number>, buffer: Array<Array<number>>) {
  let scores; // function specific
  scores = buffer.map((range)=>{
    return {
      score: Math.abs(range[0] - selectedRange[0]) + Math.abs(range[1] - selectedRange[1]),
      range: range
    }
  });
  return maxOfCollection(scores, 'score');
}

export function bufferUpdate(){
  let pdv: PointDeVue, vid: HTMLVideoElement, buffer;
  let bIndex: number, start, end;
  let buffers: {[s: string]: Array<Array<number>>} = {};
  let mergedBuffer;
  let ctx: CanvasRenderingContext2D = timerCanvas.getContext('2d');
  timerCanvas.width = window.innerWidth;
  ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, timerCanvas.width, timerCanvas.height);
  for(var key in g.pointDeVue){
    buffer = g.pointDeVue[key].getVideoBuffer();
    buffer = buffer.filter((range)=>{
      return range[1] >= g.currentFrame;
    });
    buffers[key] = buffer;
  }
  // mergedBuffer = [];

  let bufferedRange = [this.currentFrame, this.currentFrame];
  buffers.spectateur.forEach((range)=>{
    let emmaRange = findClosestRange(range, buffers.emma);
    let solvejRange = findClosestRange(range, buffers.solvej);
    for(let i = range[0]; i <= range[1]; i++){
      if(i > g.currentFrame){
        if(i >= emmaRange[0] && i < emmaRange[1] && i >= solvejRange[0] && i < solvejRange[1]){
          bufferedRange[1] = i;
        }
      }
    }
  });
  // let i = 0;
  // for (let key in g.pointDeVue){
  //   pdv = g.pointDeVue[key];
  //   ctx.fillStyle = fillStyles[key];
  //   buffer = pdv.getVideoBuffer();
  //   for(let range of buffer){
  //     start = (pdv.depart + range[0]) / CST.FILM_DATA.FIN;
  //     end = (pdv.depart + range[1]) / CST.FILM_DATA.FIN;
  //     // console.log(start, end, key);
  //     ctx.fillRect(timerCanvas.width * start, (i / 3) *  timerCanvas.height, timerCanvas.width * end, (1 / 3) *  timerCanvas.height);
  //   }
  //   i++;
  // }

  // final GRAY PART

}