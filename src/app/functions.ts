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
  console.info('SET RESOLUTION', loadTime)
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

  if(loadTime > 1500){
    r = Math.min(r, 1280)
  }
  if (loadTime > 4000){
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
export function playNextPOV(){
  // TODO: is it the best way ?..
  if(!g.nextVideo) g.nextVideo = g.currentVideo;
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
  if(g.state.isPlaying ){
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

export function pauseForBuffer(pdv: PointDeVue){
  console.log('called a pause for buffer ()!')
  g.state.bufferedPOV = pdv;
  // g.state.isBuffering = true;
  if(g.state.isPlaying && !g.state.isLoading){
    g.audio.voix.pause();
    // g.audio.voix.currentTime = g.currentFrame;
    for(let key in g.pointDeVue){
      g.pointDeVue[key].video.pause();
      // g.pointDeVue[key].video.currentTime = g.currentFrame;
      g.pointDeVue[key].audio.pause();
      // g.pointDeVue[key].audio.currentTime = g.currentFrame;
    }
  }
  moveVideoTimer(g.currentFrame);
}

export function playAfterBuffer(){
  if(g.state.isPlaying){
    g.audio.voix.play();
    for(let key in g.pointDeVue){
      g.pointDeVue[key].video.play();
      g.pointDeVue[key].audio.play();
    }
  }

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
  if(g.tutorial){
    g.tutorial.moveTo(g.currentFrame);
    g.tutorial.pause();
  }
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
  console.log('TOGGLE VIDEO', g.tutorial)
  g.state.isPlaying = !g.state.isPlaying;
  if(g.state.isPlaying){
    if (g.audio.voix.paused) g.audio.voix.play();
    if(g.tutorial) g.tutorial.play();
  }
  else {
    g.audio.voix.pause();
    console.log('should pause')
    if(g.tutorial) g.tutorial.pause();
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
  // timerBarBloc.style.borderRightWidth = window.innerWidth - timerBarBloc.offsetWidth + 'px';
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

export function findClosestRange(pdv: PointDeVue, frame?: number) {
  frame = frame - pdv.depart || g.currentFrame - pdv.depart;
  let buffer = pdv.getVideoBuffer();
  return buffer.find((range)=>{
    return frame >= range[0] && frame <= range[1]
  })
}

export function bufferUpdate(){
  let pdv: PointDeVue, vid: HTMLVideoElement, buffer;
  let pdvParams;
  let bIndex: number, start, end;
  let buffers: {[s: string]: Array<Array<number>>} = {};
  let mergedBuffer;
  let ctx: CanvasRenderingContext2D = timerCanvas.getContext('2d');
  timerCanvas.width = window.innerWidth;
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, timerCanvas.width, timerCanvas.height);
  // mergedBuffer = [];

  // Debug to see each individual buffer from each video
  // let i = 0;
  // for (let key in g.pointDeVue){
  //   pdv = g.pointDeVue[key];
  //   ctx.fillStyle = fillStyles[key];
  //   buffer = pdv.getVideoBuffer();
  //   for(let range of buffer){
  //     start = (pdv.depart + range[0]) / CST.FILM_DATA.FIN;
  //     end = (range[1] - range[0]) / CST.FILM_DATA.FIN;
  //     // console.log(start, end, key);
  //     ctx.fillRect(timerCanvas.width * start, (i / 3) *  timerCanvas.height, timerCanvas.width * end, (1 / 3) *  timerCanvas.height);
  //   }
  //   i++;
  // }

  let specRange = findClosestRange(g.pointDeVue.spectateur);
  let bufferedEnd;
  if(!specRange){
    console.log('spec range not found', g.pointDeVue.spectateur.getVideoBuffer(), g.currentFrame)
    bufferedEnd = g.currentFrame;
  }
  else{
    if (specRange[1] ==  g.currentFrame){
      console.log('[bufferUpdate()]: found end of buffer = currentframe, gonna break')
    }
    bufferedEnd = specRange[1];
  }

  if(isPointDeVueAvailable(g.pointDeVue.emma, g.currentFrame)){
    let emmaRange = findClosestRange(g.pointDeVue.emma);
    if(!emmaRange){
      console.log(emmaRange, g.currentFrame, 'emma range is out of bounds, most likely behind frame');
      bufferedEnd = Math.min(bufferedEnd, g.currentFrame);
    }
    else {
      emmaRange[0] += CST.POINTS_DE_VUE.find(pdv=> pdv.name === 'emma').depart;
      emmaRange[1] += CST.POINTS_DE_VUE.find(pdv=> pdv.name === 'emma').depart;
      bufferedEnd = Math.min(bufferedEnd, emmaRange[1])
    }
  }
  if(isPointDeVueAvailable(g.pointDeVue.solvej, g.currentFrame)){
    let solvejRange = findClosestRange(g.pointDeVue.solvej);
    if(!solvejRange){
      console.log(solvejRange, g.currentFrame, 'solvej range is out of bounds, most likely behind frame');
      bufferedEnd = Math.min(bufferedEnd, g.currentFrame);
    }
    else{
      solvejRange[0] += CST.POINTS_DE_VUE.find(pdv=> pdv.name === 'solvej').depart;
      solvejRange[1] += CST.POINTS_DE_VUE.find(pdv=> pdv.name === 'solvej').depart;
      bufferedEnd = Math.min(bufferedEnd, solvejRange[1])
    }
  }
  let bufferedRange = [g.currentFrame, bufferedEnd];
  start = bufferedRange[0] / CST.FILM_DATA.FIN;
  end = (bufferedRange[1] - bufferedRange[0]) / CST.FILM_DATA.FIN;
  ctx.fillStyle = "rgba(100, 100 ,100, .7)";
  ctx.fillRect(timerCanvas.width * start, 0, timerCanvas.width * end, timerCanvas.height);
  // final GRAY PART

}