import * as React from "react";
import {TimelineLite} from 'gsap';

export class Tutorial extends React.Component{
  title: HTMLElement;
  overlay: HTMLElement;
  emmaButton: HTMLElement;
  emmaCircle: HTMLElement;
  specButton: HTMLElement;
  solvejButton: HTMLElement;
  solvejCircle: HTMLElement;
  tl: TimelineLite = new TimelineLite();
  params = {
    start: 55,
    duration: 250
  };
  render(){
    return (
      <div className="min-container" id="tutorial">
        <div className="overlay-buttons">
          <div className="button emma" id="tutorial-emma">
            <div id="tutorial-emma-circle" className="button-circle"></div>
          </div>
          <div className="button spectateur button-spectateur" id="tutorial-spec"></div>
          <div className="button solvej" id="tutorial-solvej">
            <div id="tutorial-solvej-circle" className="button-circle"></div>
          </div>
        </div>
        <h3 className="overlay-title" id="overlay-title">Cliquez pour changer de <br /> point de vue </h3>
      </div>
    )
  }
  componentDidMount(){
    this.overlay = document.getElementById('tutorial');
    this.title = document.getElementById('overlay-title');
    this.emmaButton = document.getElementById('tutorial-emma');
    this.emmaCircle = document.getElementById('tutorial-emma-circle');
    this.specButton = document.getElementById('tutorial-spec');
    this.solvejButton = document.getElementById('tutorial-solvej');
    this.solvejCircle = document.getElementById('tutorial-solvej-circle');
    this.tl.pause();
  }
  play(){
    this.tl.resume();
  }
  pause(){
    this.tl.pause();
  }
  start(frame: number){
    console.log('start TUTORIAL');
    this.moveTo(frame);
    let onShadow = "0 0 50px rgba(11, 115, 129, 0.8)";
    let offShadow = "0 0 50px rgba(10, 84, 90, 0.5)";
    // INIT
    this.tl.set(this.overlay, {opacity: 0});
    this.tl.set(this.title, {opacity: 0, marginTop: 12});
    //buttons
    this.tl.set(this.emmaButton, {opacity: 0, boxShadow: offShadow});
    this.tl.set(this.solvejButton, {opacity: 0, boxShadow: offShadow});
    this.tl.set(this.specButton, {opacity: 1, boxShadow: onShadow});
    //circles
    this.tl.set(this.solvejCircle, {opacity: 0});
    this.tl.set(this.emmaCircle, {opacity: 0});

    //FIRST MAIN
    this.tl.to(this.overlay, 1, {opacity: 1}, "+=1.5");
    this.tl.to(this.title, 1, {opacity: 1, marginTop: 35}, "-=.5");

    // EMMA CLIC
    this.tl.to(this.emmaButton, .3, {opacity: .6}, "+=1.5");
    this.tl.set(this.specButton, {opacity: .6, boxShadow: offShadow}, "+=1");
    this.tl.set(this.emmaButton, {opacity: 1, boxShadow: onShadow});
    this.tl.set(this.emmaCircle, {opacity: 1});
    this.tl.to(this.emmaCircle, .45, {opacity:.5, transform: "scale(1.55)"});
    this.tl.to(this.emmaCircle, .5, {opacity:0, transform: "scale(1.9)"});

    //solvej clic
    this.tl.to(this.solvejButton, .3, {opacity: .6}, "+=.5");
    this.tl.set(this.emmaButton, {opacity: .6, boxShadow: offShadow}, "+=1");
    this.tl.set(this.solvejButton, {opacity: 1, boxShadow: onShadow});
    this.tl.set(this.solvejCircle, {opacity: 1});
    this.tl.to(this.solvejCircle, .45, {opacity:.5, transform: "scale(1.55)"});
    this.tl.to(this.solvejCircle, .5, {opacity:0, transform: "scale(1.9)"});

    //end
    this.tl.to(this.overlay, 1, {opacity: 0}, "+=3.5");
    // this.tl.to(this.emmaButton, .5, {opacity: 0}, "-= .8");
    this.tl.to(this.title, 1, {opacity: 0}, "-=1.5");
    this.tl.resume();
  }
  moveTo(frame: number){
    this.tl.progress(Math.min(1,Math.max(0,(frame - this.params.start) / this.params.duration)));
    this.pause();

  }
}