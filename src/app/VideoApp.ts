import {g} from "./globals";
import {CST} from "./const";
import {
  bufferUpdate,
  drawDebugTimeline, findClosestRange, findClosestShotFrame, frameToSecond,
  getAbsoluteFrame, isPointDeVueAvailable, playNextPOV, resize,
  secondToFrame, selectVideo, setLoading,
  setResolution, setVolume,
  spawnPointDeVue,
  toggleVideo
} from "./functions";
import {DebugElement} from "./class/debugElement";
import {LoaderService} from "./class/MediaLoader";
import '../styles/style.scss';
import {Tutorial} from "./components/Tutorial";
import {PointDeVue} from "./class/PointDeVue";


/*
Système de load wait sur les vidéos.
Il faut, après avoir set le timer d'une vidéo,
attendre un load suffisant pour switcher la vidéo.
Il faut laisser l'ancienne vidéo, si existante,
jouer et par dessus. Animer le bouton
*/

export interface ViewinRange {
  pov: string,
  range: [number, number]
}

export class VideoApp{
  tutorial: Tutorial;
  onCompleteCallback: Function;
  viewingRanges: Array<ViewinRange> = [];
  constructor(onCompleteCallback: Function){
    this.onCompleteCallback = onCompleteCallback;
    CST.POINTS_DE_VUE.forEach(pointDeVue=>{
      spawnPointDeVue(pointDeVue)
    });
    g.audio.voix = document.createElement("audio");
    g.audio.voix.src = "assets/audio/voix.mp3";
    //audio loading service
    LoaderService.load(g.audio.voix);
    // LoaderService.update();
    LoaderService.onLoad((loadTime)=>{
      console.log('____ LOADER SERVICE AUDIO FINISHED ____');
      console.log('');
      setResolution(loadTime);
      for(let key in g.pointDeVue){
        g.pointDeVue[key].load();
      }
      window.requestAnimationFrame(this.frameUpdate);
    });
    this.frameUpdate = this.frameUpdate.bind(this);
  }
  onLoad(loadTime: number){
    console.log('LOADER FULL LOAD EVENT');
    g.audio.voix.volume = 1;
    g.state.isAudioLoaded = true;
    setVolume(1);
    this.inputHandle();
    resize();
    window.onresize = resize;
    g.currentTimestamp = performance.now();
    selectVideo('spectateur');
    if(!g.checkMobile()){
      toggleVideo();
    }
    this.moveVideoTimer(0);
    if(CST.DEBUG){
      g.debugElements = g.debugElements.concat([
        new DebugElement('frame-count', ()=>{return g.currentFrame.toFixed(0)}),
        new DebugElement('abs-pov-frame', ()=>{return  (g.pointDeVue[g.currentVideo].depart + secondToFrame(g.pointDeVue[g.currentVideo].video.currentTime))}),
        new DebugElement('voix-frame', ()=>{return  secondToFrame(g.audio.voix.currentTime) }),
        new DebugElement('cab-abs-frame', ()=>{return  (g.pointDeVue.spectateur.depart + secondToFrame(g.pointDeVue.spectateur.video.currentTime))}),
        new DebugElement('cab-audio-frame', ()=>{return  (g.pointDeVue.spectateur.depart + secondToFrame(g.pointDeVue.spectateur.audio.currentTime))}),
        new DebugElement('emma-abs-frame', ()=>{return  (g.pointDeVue.emma.depart + secondToFrame(g.pointDeVue.emma.video.currentTime))}),
        new DebugElement('emma-audio-frame', ()=>{return  (g.pointDeVue.emma.depart + secondToFrame(g.pointDeVue.emma.audio.currentTime))}),
        new DebugElement('solvej-pov-frame', ()=>{return  (g.pointDeVue.solvej.depart + secondToFrame(g.pointDeVue.solvej.video.currentTime))}),
        new DebugElement('cabane-speed', ()=>{return  g.pointDeVue.spectateur.video.playbackRate}),
        new DebugElement('audio-volume', ()=>{return  g.audio.voix.volume}),
        new DebugElement('audio-playbackrate', ()=>{return  g.audio.voix.playbackRate}),
        new DebugElement('audio-currenttime', ()=>{return  g.audio.voix.currentTime}),
        // new DebugElement('current-pov-frame', ()=>{return secondToFrame(g.pointDeVue[g.currentVideo].video.currentTime).toFixed(0)}),

      ]);
      drawDebugTimeline();
    }
    else {
      // drawDebugTimeline();
      document.getElementById('debug-container').classList.add('hide');
    }

    document.onmousemove = function(e){
      g.mouse.x = e.pageX;
      g.mouse.y = e.pageY;
    };
  }

  onIntroComplete(tutorial: Tutorial){
    this.tutorial = tutorial;
    g.tutorial = tutorial;
    g.state.isIntroComplete = true;
  }
  inputHandle(){
    //key handle
    window.addEventListener('keydown', function(event){
      if(event.keyCode === 32) { //space
        toggleVideo();
        event.preventDefault();
      }
      else if (event.keyCode === 37 ) { // left
        selectVideo('emma');
        event.preventDefault();
      }
      else if (event.keyCode === 40 ) { // down
        selectVideo('spectateur');
        event.preventDefault();
      }
      else if (event.keyCode === 39 ) { // right
        selectVideo('solvej');
        event.preventDefault();
      }
    });
  }
  frameUpdate(){
    if(!g.state.isAudioLoaded || !g.state.isIntroComplete){
      //TODO: remove this state
      window.requestAnimationFrame(this.frameUpdate);
    }
    else {
      // console.log("audio loaded")
      let currPdv, key;
      g.deltaTimestamp = performance.now() - g.currentTimestamp;
      g.currentTimestamp = performance.now();
      // film is playing
      if(g.state.isPlaying && !g.state.isWaiting){
        if(g.currentFrame <= CST.CREDITS_START){
          //viewing range for stat
          if(this.viewingRanges.length == 0){
            this.viewingRanges.push({
              pov: g.currentVideo,
              range: [g.currentFrame, g.currentFrame]
            });
          }
          else if(this.viewingRanges[this.viewingRanges.length - 1].pov === g.currentVideo){
            this.viewingRanges[this.viewingRanges.length - 1].range[1] = g.currentFrame;
          }
          else {
            this.viewingRanges.push({
              pov: g.currentVideo,
              range: [g.currentFrame, g.currentFrame]
            });
            // console.log(this.viewingRanges)
          }

        }
        //save ranges on credits start
        else if(!g.statSave.saving){
          g.statSave.startSave(this.viewingRanges);
        }



        //subtitles
        g.subtitles.updateTimer(g.currentFrame);

        //general frame update
        g.filmTimestamp += g.deltaTimestamp;
        g.currentFrame = secondToFrame(g.filmTimestamp / 1000);
      }else{
        // console.log('g.state.isPlaying', g.state.isPlaying, '!g.state.isWaiting', !g.state.isWaiting, g.state.isLoading)
      }

      //playback rate
      for (key in g.pointDeVue){
        currPdv = g.pointDeVue[key];
        if (isPointDeVueAvailable(currPdv, g.currentFrame)) {
          if(currPdv.button.classList.contains('hide') && g.currentFrame <= CST.FULL_END){
            currPdv.button.classList.remove('hide');
          }

          let currentFramePdv = getAbsoluteFrame(currPdv);
          let closestRange = findClosestRange(currPdv, g.currentFrame);
          if(!g.state.isLoading && (!closestRange || (g.currentFrame - currPdv.depart >= closestRange[1]))){
            console.log('called for pause by', currPdv.tag, closestRange, currPdv.getVideoBuffer(), g.currentFrame)
            this.pauseForBuffer(currPdv);
          }
          // console.log('timediff on ', key, g.currentFrame - currentFramePdv, g.currentFrame, currentFramePdv)
          if((g.frameLoop % 5) == 0 || g.state.isLoading){
            //video
            let timeDiff = frameToSecond(g.currentFrame) - frameToSecond(currentFramePdv);
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
          playNextPOV();
        }
        else if (!currPdv.button.classList.contains('hide')){
          currPdv.button.classList.add('hide');
        }
        currPdv.video.previousTime = currPdv.video.currentTime;
      } // end of playback rate

      //loading checks
      if(g.state.isLoading){
        // are all points of view ready
        let ready = true;
        for(key in g.pointDeVue){
          if(ready && !g.pointDeVue[key].isReady()) ready = false;
        }
        let validState = false; // fulfills any of the conditions below
        if(!g.nextShotFrame && !findClosestShotFrame(g.currentFrame)){
          validState = true
        }
        // if behind a scene cut, but bypassed by timer moved
        else if(findClosestShotFrame(g.currentFrame) && g.state.isWaiting){ // going back or init
          validState = true
        }
        // pause current video for one frame, to prevent mid-frame show of next scene cut on swap
        else if(g.nextShotFrame && g.currentFrame == g.nextShotFrame){
          g.pointDeVue[g.currentVideo].video.pause();
        }
        else if(g.nextShotFrame && g.currentFrame > g.nextShotFrame){
          validState = true;
        }
        if(ready && validState) playNextPOV();
        else {
          console.log('ready', ready, 'validstate', validState)
        }
      }
      else{
        bufferUpdate();
        if(g.state.isPlaying && g.currentFrame >= this.tutorial.params.start
          && g.currentFrame < this.tutorial.params.start + this.tutorial.params.duration
          && this.tutorial.tl.paused()
        ){
          this.tutorial.start(g.currentFrame);
        }
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

      g.videoBar.updateBar();
      let blackS = document.getElementsByClassName('black-screen')[0];
      if(!isPointDeVueAvailable(g.pointDeVue.spectateur, g.currentFrame) && blackS.classList.contains('hide')){
        blackS.classList.remove('hide');
        setTimeout(()=>{
          this.onCompleteCallback(this.viewingRanges);
        }, 400);
      }
      else {
        window.requestAnimationFrame(this.frameUpdate);
      }
    }
    //video end
  }

  pauseForBuffer(pdv: PointDeVue){
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
    console.log('[PauseForBUffer]: going from ', g.currentFrame, 'to ', secondToFrame(pdv.video.currentTime));
    this.moveVideoTimer(pdv.depart + secondToFrame(pdv.video.currentTime));
  }

  moveVideoTimer(frame: number){
    frame = Math.round(frame);
    g.state.isWaiting = true;
    if (!g.audio.voix.paused) g.audio.voix.pause();
    g.audio.voix.currentTime = Math.min(CST.FILM_DATA.FIN, Math.max(0, frameToSecond(frame)));
    let currPdv;
    for (let key in g.pointDeVue){
      currPdv = g.pointDeVue[key];
      currPdv.video.currentTime = "" + Math.min(currPdv.fin, Math.max(0, frameToSecond(frame -  currPdv.depart))) + "";
      currPdv.audio.currentTime = Math.min(currPdv.fin, Math.max(0, frameToSecond(frame - currPdv.depart)));
      currPdv.video.play();
      currPdv.video.pause();
      currPdv.audio.play();
      currPdv.audio.pause();
    }
    g.filmTimestamp = frameToSecond(frame) * 1000;
    g.currentFrame = frame;
    g.previousFrame = frame - 1;
    this.viewingRanges.push({
      pov: g.currentVideo || 'spectateur',
      range: [g.currentFrame, g.currentFrame]
    });
    setLoading(true);
    if(g.tutorial){
      g.tutorial.moveTo(g.currentFrame);
      g.tutorial.pause();
    }
    if(g.checkMobile() && g.state.isPlaying){
      toggleVideo()
    }
  }
  kill(){
    g.audio.voix.pause();
    g.audio.voix.src = "";
    g.audio.voix.load();
    for(let key in g.pointDeVue){
      g.pointDeVue[key].kill();
    }
  }

}


window.onresize = resize;
