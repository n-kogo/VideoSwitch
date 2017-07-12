import {g} from './globals'
import {CST} from './const'
import {DebugElement} from "./class/debugElement";
import {PointDeVue} from "./class/PointDeVue";

let frameBloc, pdvBloc, absPdvBloc, spectaBloc,
  emmaBloc, solvejBloc;
let timerBarBloc, timerBarContainerBloc;

timerBarBloc = document.getElementById('timer-bar');
timerBarContainerBloc = document.getElementById('timer-bar-container');


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

// MAIN LOOP

export function frameUpdate(){
  let currPdv, key;
  g.deltaTimestamp = performance.now() - g.currentTimestamp;
  g.currentTimestamp = performance.now();
  if(g.state.isPlaying && !g.state.isWaiting){
    g.filmTimestamp += g.deltaTimestamp;
    g.currentFrame = secondToFrame(g.filmTimestamp / 1000);
  }
  if(g.state.isLoading){
    // if both audio are ready
    if(g.audio.voix.readyState === 4){
      // if no shot frame nearby
      if(!g.nextShotFrame && !findClosestShotFrame(g.currentFrame)){
        let ready = true;
        for(key in g.pointDeVue){
          if(ready && !g.pointDeVue[key].isReady()) ready = false;
        }
        if(ready){
          g.nextShotFrame = null;
          g.state.isWaiting = false;
          playVideo();
        }
      }
      // or if at next g.frame
      else if(g.nextShotFrame && g.currentFrame > g.nextShotFrame){
        let ready = true;
        for(key in g.pointDeVue){
          if(ready && !g.pointDeVue[key].isReady()) ready = false;
        }
        if(ready){
          g.nextShotFrame = null;
          g.state.isWaiting = false;
          playVideo();
        }
        // debugger;
      } else if(g.nextShotFrame && g.currentFrame == g.nextShotFrame){
        g.pointDeVue[g.currentVideo].video.pause();
      }
      else if(findClosestShotFrame(g.currentFrame) && g.state.isWaiting){ // going back or init
        let ready = true;
        for(key in g.pointDeVue){
          if(ready && !g.pointDeVue[key].isReady()) ready = false;
        }
        if(ready){
          g.state.isWaiting = false;
          playVideo();
        }
      }
    }

  }
  //playback rate
  for (key in g.pointDeVue){
    currPdv = g.pointDeVue[key];
    if (isPointDeVueAvailable(currPdv, g.currentFrame)) {
      if(currPdv.button.classList.contains('hide') && g.currentFrame <= CST.FULL_END){
        currPdv.button.classList.remove('hide');
      }
      if((g.frameLoop % 5) == 0 || g.state.isLoading){
        //video
        let timeDiff = frameToSecond(g.currentFrame) - frameToSecond(getAbsoluteFrame(currPdv));
        let compensatingFrameRate: number = parseFloat(((Math.min(Math.max((timeDiff / 2 + 1), 0.33), 3.00))).toFixed(2));
        if (compensatingFrameRate > .99 && compensatingFrameRate < 1.01) {
          compensatingFrameRate = 1.00;
        }
        currPdv.video.playbackRate = compensatingFrameRate;
      }
      if (currPdv.video.paused && currPdv.video.currentTime <= frameToSecond(1) && g.state.isPlaying && !g.state.isLoading){
        if(currPdv.video.readyState == 4 && currPdv.audio.readyState == 4){
          currPdv.video.play();
          currPdv.audio.play();
        }
        else {
          console.error('well thats a good one, pov not loaded');
        }
      }
    }
    else if(key == g.currentVideo && key !== 'spectateur'){
      currPdv.button.classList.add('hide');
      selectVideo('spectateur');
      playVideo();
    }
    else if (!currPdv.button.classList.contains('hide')){
      currPdv.button.classList.add('hide');
    }
    currPdv.video.previousTime = currPdv.video.currentTime;
  }

  if(CST.DEBUG){
    if(g.currentVideo){
      g.debugElements.forEach((debugElement: DebugElement)=>{
        debugElement.update();
      });
    }
  }
  g.frameLoop++;
  if(g.frameLoop >= 60){
    g.frameLoop = 0;
  }
  g.previousFrame = g.currentFrame;
  if(g.currentFrame > CST.FULL_END && !g.pointDeVue[g.currentVideo].button.classList.contains('hide')){
    g.pointDeVue[g.currentVideo].button.classList.add('hide');
    g.pointDeVue[g.currentVideo].button.classList.remove('active');
  }
  updateTimerBar();
  if(!isPointDeVueAvailable(g.pointDeVue.spectateur, g.currentFrame) && document.getElementById('loading-container').classList.contains('hide')){
    document.getElementById('loading-container').classList.remove('hide');
  }
  else {
    window.requestAnimationFrame(frameUpdate);
  }
  //video end
}
