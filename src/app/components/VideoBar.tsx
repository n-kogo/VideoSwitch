import * as React from "react";
import {isPointDeVueAvailable, moveVideoTimer, selectVideo, setVolume} from "../functions";
import {g} from "../globals";
import {CST} from "../const";

export class VideoBar extends React.Component<any, any> {
  handleAction: Function
  constructor(props: any){
    super(props);
    this.handleAction = props.handle;
    this.state = {
      isPlaying: g.state.isPlaying,
      volume: g.volume
    }
  }
  render(){
    let percent = this.state.volume * 100 + '%';
    console.log('volument percent', percent);
    return (
      <div className="video-bar">
        <div className={"video-bar__play " + (this.state.isPlaying ? 'playing' : 'paused')} onClick={()=> this.handleAction('play')}></div>
        <div id="timer-bar-container" onClick={(e)=> this.handleTimerClick(e)}>
          <div id="timer-bar">
            <div className="timer-bar-handle"></div>
          </div>
          <canvas id="timer-background" width="600" height="5"></canvas>
        </div>
        <div className="volume-control">
          <div className="volume-control__wrapper" onClick={(e)=>this.handleVolumeClick(e)}>
            <div className="volume-control__bar-container" >
              <div className="volume-control__bar" style={{width: percent}}>
                <div className="volume-control__handle"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="video-bar__subtitles">S T</div>
        <div className="video-bar__fullscreen" onClick={()=> this.handleAction('fullscreen')}>
          <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
            <g className="fs-button-corner-0">
              <path className="svg-white-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path>
            </g>
            <g className="fs-button-corner-1">
              <path className="svg-white-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path>
            </g>
            <g className="fs-button-corner-2">
              <path className="svg-white-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path>
            </g>
            <g className="fs-button-corner-3">
              <path className="svg-white-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path>
            </g>
          </svg>
        </div>
      </div>
    )
  }
  handleVolumeClick(e){
    let eBounds = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - eBounds.left;
    let percent = x / e.currentTarget.clientWidth;
    setVolume(percent);
  }
  updateVolumeBar(percent: number){
    this.setState({
      volume: percent
    });
  }

  updatePlayStatus(state: boolean){
    this.setState({
      isPlaying: state
    });
  }
  handleTimerClick(e){
    let eBounds = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - eBounds.left;
    let percent = x / e.currentTarget.clientWidth;
    let newFrame = CST.FILM_DATA.FIN * percent;
    if(!isPointDeVueAvailable(g.pointDeVue[g.currentVideo], newFrame)){
      selectVideo('spectateur', true);
    }
    else {
      selectVideo(g.currentVideo, true);
    }
    moveVideoTimer(newFrame);
  }
}