import * as React from 'react';
import {LoaderService} from "../class/MediaLoader";
import './loader.scss';

export class AppLoader extends React.Component<any, any>{
  state: {
    loadedPercent: number;
  };
  loadedString: string;
  barStyle: any;
  constructor(props: any){
    console.log('props on load', props);
    super(props);
    this.state = {loadedPercent: props.loadedPercent};
    LoaderService.onUpdate((data)=>{
      this.onLoadUpdate(data);
    })
  }
  onLoadUpdate(data){
    let roundData = Math.round(data * 10) / 10;
    if(roundData != this.state.loadedPercent){
      console.log('FILM.TSX => set State load percent', roundData)
      this.setState({loadedPercent: roundData});
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
      <div>
        <div className="loading-bar-container">
          <div className="loading-bar" style={this.barStyle}>{this.state.loadedPercent + '%'}</div>
        </div>
      </div>
    )
  }
  setLoadedPercent(value: number){
    this.state.loadedPercent = value;
  }
}