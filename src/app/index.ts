import {g} from "./globals";
import {CST} from "./const";
import {
  drawDebugTimeline,
  frameUpdate, isPointDeVueAvailable, launchTimerEvents, moveVideoTimer, resize, secondToFrame, selectVideo,
  spawnPointDeVue,
  toggleVideo
} from "./functions";
import {DebugElement} from "./class/debugElement";
import {LoaderService} from "./class/MediaLoader";
import '../styles/style.scss';


/*
Système de load wait sur les vidéos.
Il faut, après avoir set le timer d'une vidéo,
attendre un load suffisant pour switcher la vidéo.
Il faut laisser l'ancienne vidéo, si existante,
jouer et par dessus. Animer le bouton
*/


window.onload = function(){
  CST.POINTS_DE_VUE.forEach(pointDeVue=>{
    spawnPointDeVue(pointDeVue)
  });
  //TODO: add audio to each pdv
  g.audio.voix = document.createElement("audio");
  g.audio.voix.src = "assets/audio/voix.mp3";
  LoaderService.load(g.audio.voix);

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

  launchTimerEvents();
  resize();
  g.currentTimestamp = performance.now();
  selectVideo('spectateur');
  toggleVideo();
  moveVideoTimer(0);
  if(CST.DEBUG){
    g.debugElements = g.debugElements.concat([
      new DebugElement('frame-count', ()=>{return g.currentFrame.toFixed(0)}),
      new DebugElement('abs-pov-frame', ()=>{return "" + (g.pointDeVue[g.currentVideo].depart + secondToFrame(g.pointDeVue[g.currentVideo].video.currentTime))}),
      new DebugElement('audio-frame', ()=>{return "" + secondToFrame(g.audio.voix.currentTime) }),
      new DebugElement('cab-abs-frame', ()=>{return "" + (g.pointDeVue.spectateur.depart + secondToFrame(g.pointDeVue.spectateur.video.currentTime))}),
      new DebugElement('cab-audio-frame', ()=>{return "" + (g.pointDeVue.spectateur.depart + secondToFrame(g.pointDeVue.spectateur.audio.currentTime))}),
      new DebugElement('emma-abs-frame', ()=>{return "" + (g.pointDeVue.emma.depart + secondToFrame(g.pointDeVue.emma.video.currentTime))}),
      new DebugElement('solvej-pov-frame', ()=>{return "" + (g.pointDeVue.solvej.depart + secondToFrame(g.pointDeVue.solvej.video.currentTime))}),
      new DebugElement('cabane-speed', ()=>{return "" + g.pointDeVue.spectateur.video.playbackRate}),
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

  window.requestAnimationFrame(frameUpdate);
};


window.onresize = resize;
