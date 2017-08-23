import * as React from "react";
import axios from 'axios';
import {subtitles} from "../data/subtitles";


export interface Subtitle{
  text: string;
  owner: string;
  start: number;
  end: number
}

export type supportedLangs = 'FR' | 'EN' | 'ES' | null;

interface SubtitlesState{
  lang: supportedLangs;
  currentSub: Subtitle | null;
}

export class Subtitles extends React.Component<any, SubtitlesState> {
  subtitles: {[s: string]: Array<Subtitle>} = subtitles;
  frame: number;
  constructor(props: any){
    super(props);
    this.state = {
      lang: null,
      currentSub: null
    }
  }
  render(){
    if(this.state.currentSub){
      return (
        <div className="subtitles">
          <p>{this.state.currentSub.text}</p>
        </div>
      )
    }
    else {
      return (
        <span></span>
      )
    }

  }
  updateLang(value: supportedLangs){
    this.setState({
      lang: value
    })
  }
  updateTimer(frame: number){
    this.frame = frame;
    if(this.state.lang){
      let newSub = this.subtitles[this.state.lang].find((subtitle: Subtitle)=>{
        return subtitle.start <= this.frame && subtitle.end >= this.frame;
      });
      if(newSub && (!this.state.currentSub || newSub.text !== this.state.currentSub.text)){
        this.setState({
          currentSub: newSub
        })
      }
      else if (!newSub && this.state.currentSub){
        this.setState({
          currentSub: null
        })
      }
    }
  }
}