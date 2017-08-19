import * as React from "react";
import '../../styles/style.scss';
import {VideoApp} from "../VideoApp";
import {cacheDomElements, toggleFullscreen, toggleVideo} from "../functions";
import {AppLoader} from "../components/Loader";
import {g} from "../globals";
import {IntroText} from "../components/IntroText";
import {Tutorial} from "../components/Tutorial";
import {VideoBar} from "../components/VideoBar";
import {BufferOverlay} from "../components/BufferOverlay";

export class Film extends React.Component<any, any>{
  app: VideoApp;
  videoUpdateCb: Array<Function> = [];
  constructor(props){
    super(props);
    this.state = {loadedPercent: 0};
    this.onVideoUpdate = this.onVideoUpdate.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onIntroComplete = this.onIntroComplete.bind(this);
    this.loadUpdate();
  }
  loadUpdate(){
    let load = 0;
    for(let key in g.pointDeVue){
      load += g.pointDeVue[key].video.readyState;
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
        <div className="app-container">
          <div id="pause-overlay">
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
          <div className="container-button">
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
    cacheDomElements();
    this.app = new VideoApp();
    g.videoBar = this.refs.videoBar as VideoBar;
    g.bufferOverlay = this.refs.bufferOverlay as BufferOverlay;
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
  handleAction(key: string){
    switch(key){
      case 'play':
        toggleVideo();
        break;
      case 'fullscreen':
        toggleFullscreen();
    }
  }
}