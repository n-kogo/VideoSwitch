import * as React from "react";
import '../../styles/style.scss';
import {VideoApp} from "../index";
import {cacheDomElements} from "../functions";
import {AppLoader} from "../components/Loader";

export class Film extends React.Component<any, any>{
  app: VideoApp;
  constructor(props){
    super(props);
    this.state = {loadedPercent: 0};
  }
  render(){
    return (
      <div>
        <div id="loading-container">
          <AppLoader />
          <div className="pulse-loader"></div>
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
              <source src="assets/videos/spectateur.mp4" type="video/mp4" />
            </video>
            <video width="400" height="222" id="emma">
              <source src="assets/videos/emma.mp4" type="video/mp4" />
            </video>
            <video width="400" height="222" id="solvej">
              <source src="assets/videos/solvej.mp4" type="video/mp4" />
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
              <canvas id="timer-background" width="600" height="20"></canvas>
            </div>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(){
    cacheDomElements();
    this.app = new VideoApp();
  }
}