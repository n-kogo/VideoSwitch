import * as React from "react";
import '../../styles/style.scss';
import {VideoApp} from "../VideoApp";
import {
  cacheDomElements, isPointDeVueAvailable, selectVideo, toggleFullscreen,
  toggleVideo
} from "../functions";
import {AppLoader} from "../components/Loader";
import {g, resetGlobals} from "../globals";
import {IntroText} from "../components/IntroText";
import {Tutorial} from "../components/Tutorial";
import {VideoBar} from "../components/VideoBar";
import {BufferOverlay} from "../components/BufferOverlay";
import { withRouter } from 'react-router';
import axios from 'axios';
import {Subtitles, supportedLangs} from "../components/Subtitles";
import {LoaderService} from "../class/MediaLoader";
import {StatSaveInfo} from "../components/StatSaveInfo";

interface FilmState{
  loadedPercent: number,
}

class FilmWithoutRouter extends React.Component<any, FilmState>{
  app: VideoApp;
  videoUpdateCb: Array<Function> = [];
  history: any;
  constructor(props){
    super(props);
    //flush dirty globals ...
    resetGlobals();
    LoaderService.flush();

    this.history = props.history;
    this.onVideoUpdate = this.onVideoUpdate.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.loadUpdate();
    this.state = {
      loadedPercent: 0,
    };

    //bindings
    this.onIntroComplete = this.onIntroComplete.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }
  loadUpdate(){
    let load = 0;
    for(let key in g.pointDeVue){
      load += g.pointDeVue[key].video.readyState;
      console.log(load, 'load after', key);
    }
    load = load * 100 /  12; // 12 for 3 pov * 4 possible states;
    this.videoUpdateCb.forEach(function(cb){
      cb(load);
    });
    if(load < 100){
      window.requestAnimationFrame(()=> this.loadUpdate())
    }
  }
  render(){

    return (
      <div>
        <div id="loading-container">
          <AppLoader onLoad={this.onLoad} onVideoLoadUpdate={this.onVideoUpdate} />
        </div>
        <IntroText ref="intro" onComplete={this.onIntroComplete} />
        <div className="app-container" onTouchStart={()=>this.handleEmptyTouch()}>
          <div className="black-screen hide"></div>
          <div id="pause-overlay">
            <div className="pause-overlay__button" onTouchEnd={()=>toggleVideo()}></div>
          </div>
          <BufferOverlay ref="bufferOverlay" />
          <Tutorial ref="tutorial"/>
          <div className="container-video" id="container-video">
            <video width="400" height="222" id="spectateur">
            </video>
            <video width="400" height="222" id="emma">
            </video>
            <video width="400" height="222" id="solvej">
            </video>
          </div>
          <div id="debug-container">
          </div>
          <Subtitles ref="subtitles" />
          <div className="container-button">
            <StatSaveInfo ref="statSave" />
            <div className="button hide emma" id="emma-bt">
            </div>
            <div className="button hide spectateur button-spectateur" id="spectateur-bt">
            </div>
            <div className="button hide solvej" id="solvej-bt">
            </div>
            <VideoBar ref="videoBar" handle={this.handleAction} isPlaying={g.state.isPlaying}/>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(){
    console.info('Welcome on Le Refuge des Souvenirs! :)');
    console.info('Code is still a bit rough around the edges, you may encouter some minor issues.')
    cacheDomElements();
    this.app = new VideoApp(this.onComplete);
    g.videoBar = this.refs.videoBar as VideoBar;
    g.subtitles = this.refs.subtitles as Subtitles;
    g.bufferOverlay = this.refs.bufferOverlay as BufferOverlay;
    g.statSave = this.refs.statSave as StatSaveInfo;

  }
  componentWillUnmount(){
    this.app.kill();
  }
  //pass callbacks to app through reacgt components
  onLoad(loadTime){
    (this.refs.intro as IntroText).start();
    this.app.onLoad(loadTime);
  }
  onIntroComplete(){
    this.app.onIntroComplete(this.refs.tutorial as Tutorial);
  }
  onVideoUpdate(fn: Function){
    this.videoUpdateCb.push(fn);
  }
  onComplete(data: any){
    this.history.push('/stats');
  }
  handleAction(key: string, value?: any){
    switch(key){
      case 'play':
        toggleVideo();
        break;
      case 'fullscreen':
        toggleFullscreen();
        break;
      case 'subtitles':
        this.toggleSubtitles(value);
        break;
      case 'moveTimer':
        if(!isPointDeVueAvailable(g.pointDeVue[g.currentVideo], value)){
          selectVideo('spectateur', true);
        }
        else {
          selectVideo(g.currentVideo, true);
        }
        this.app.moveVideoTimer(value);
        break;
    }
  }
  toggleSubtitles(lang: supportedLangs){
    g.subtitles.updateLang(lang);
  }

  //mobile specific function
  handleEmptyTouch(){
    // console.log('youpi empty');
    if(g.checkMobile()){
      g.videoBar.showBar();
    }
  }
}

var Film = withRouter(FilmWithoutRouter);
export {Film};