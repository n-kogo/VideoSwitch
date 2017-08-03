import * as React from "react";
import '../../styles/style.scss';
import {VideoApp} from "../index";
import {cacheDomElements} from "../functions";
import {AppLoader} from "../components/Loader";

export class Film extends React.Component<any, any>{
  app: VideoApp;
  videoUpdateCb: Array<Function> = [];
  constructor(props){
    super(props);
    this.state = {loadedPercent: 0};
    this.app = new VideoApp();
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
    window.requestAnimationFrame(this.loadUpdate)
  }
  render(){
    return (
      <div>
        <div id="loading-container">
          <AppLoader onLoad={this.onLoad} onVideoLoadUpdate={this.onVideoUpdate} />
          {/*<div className="pulse-loader"></div>*/}
        </div>
        <div className="app-container">
          <div id="overlay">
            <div className="min-container">
              <div className="overlay-buttons">
                <div className="button emma"></div>
                <div className="button spectateur button-spectateur"></div>
                <div className="button solvej"></div>
              </div>
              <h3 className="overlay-title">Cliquez pour changer de <br /> point de vue </h3>
            </div>
          </div>
          <div id="pause-overlay">
          </div>
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
            <div id="timer-bar-container" className="">
              <div id="timer-bar">
                <div className="timer-bar-handle"></div>
              </div>
              <div id="timer-bar-buffer"></div>
              <canvas id="timer-background" width="600" height="20"></canvas>
            </div>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(){
    cacheDomElements();
  }
  onLoad(loadTime){
    this.app.onLoad(loadTime);
  }
  onVideoUpdate(fn: Function){
    this.videoUpdateCb.push(fn);
  }
}