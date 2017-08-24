import * as React from "react";
import {TimelineLite} from 'gsap';
import './IntroText.scss';

export class IntroText extends React.Component<any, any>{
  text: HTMLElement;
  container: HTMLElement
  tl: TimelineLite = new TimelineLite();
  callback: Function;
  constructor(props: any){
    super(props);
    this.callback = props.onComplete;
  }
  render(){
    return (
      <div className="intro-text" id="intro-container">
        <div className="intro-text__value" id="intro-text">
          Ce court métrage met en scène trois points de vue d'une seule et même histoire. <br />
          Il sera possible, à certains moments du film, de changer de vision comme bon vous semble.
        </div>
      </div>
    )
  }
  componentDidMount(){
    this.text = document.getElementById('intro-text');
    this.container = document.getElementById('intro-container')
  }
  start(){
    // console.log('starting animation');
    this.tl.to(this.container, 0.6, {opacity: 1}, "+=0.15");
    this.tl.to(this.text, 1, {opacity: 1}, "+=0.65");
    this.tl.to(this.container, 6.5, {opacity: 1, onComplete: ()=>{
      this.callback();
    }}, "-=0.5");
    this.tl.to(this.text, 0.65, {opacity: 0}, "-=0.9");
    this.tl.to(this.container, .8, {opacity: 0, }, "+=0.5");
    // this.tl.from(this.text, 0.5, {opacity: 1, top: 0}, "-= 0.2");
    // this.tl.to(this.text, 0.5, {
    //   opacity: 0,
    //   top: -50,
    //   onComplete: ()=>{
    //     console.log('animation complete')
    //     this.callback()
    //   },
    // },"+=5");
  }
}