import * as React from 'react';
import {LoaderService} from "../class/MediaLoader";
import './loader.scss';
import {g} from "../globals";

export class AppLoader extends React.Component<any, any>{
  startTime: number;
  state: {
    loadedPercent: number;
  };
  loads: {
    audio: number;
    video: number;
  } = {
    audio: 0,
    video: 0
  };
  onLoadCallback: Function;
  loadedString: string;
  barStyle: any;
  constructor(props: any){
    super(props);
    this.onLoadCallback = props.onLoad;
    this.state = {loadedPercent: 0};
    LoaderService.onUpdate((data)=>{
      this.onLoadUpdate({audio:data});
    });
    props.onVideoLoadUpdate((data)=>{
      this.onLoadUpdate({video: data});
    });
  }
  onLoadUpdate(data: {video?: number, audio?: number}){
    if(!this.startTime) this.startTime = performance.now();
    if(data.video){
      this.loads.video = data.video;
    }
    if(data.audio){
      this.loads.audio = data.audio;
    }
    let globalLoad = (this.loads.audio * .7 + this.loads.video * .3);
    let roundData = Math.round(globalLoad * 10) / 10;
    if(roundData != this.state.loadedPercent){
      console.log('FILM.TSX => set State load percent', roundData)
      this.setState({loadedPercent: roundData});
      if(roundData >= 99.9){
        this.onLoadCallback(performance.now() - this.startTime);
      }
    }
  }
  componentWillReceiveProps(props){
    this.setState({loadedPercent: props.loadedPercent});
  }
  render(){
    console.log('APPLOADER.TSX => update render');
    this.loadedString = this.state.loadedPercent + '%';
    this.barStyle = {
      width: this.loadedString
    };
    return (
      <div className="loading">
        <h3>
          Chargement
        </h3>
        <div className="loading__container">
          <div className="loading__bar" style={this.barStyle}></div>
        </div>
        <div className="loading__percent">
          {this.state.loadedPercent + '%'}
        </div>
      </div>
    )
  }
  setLoadedPercent(value: number){
    this.state.loadedPercent = value;
  }
}