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
    start: 75,
    duration: 250
  };
  render(){
    return (
      <div id="tutorial">
        <div className="min-container">
          <div className="overlay-buttons">
            <div className="button emma" id="tutorial-emma">
              <div id="tutorial-emma-circle"></div>
            </div>
            <div className="button spectateur button-spectateur" id="tutorial-spec"></div>
            <div className="button solvej" id="tutorial-solvej">
              <div id="tutorial-solvej-circle"></div>
            </div>
          </div>
          <h3 className="overlay-title" id="overlay-title">Cliquez pour changer de <br /> point de vue </h3>
        </div>
      </div>
    )
  }
  componentDidMount(){
    this.overlay = document.getElementById('tutorial');
    this.title = document.getElementById('overlay-title');
    this.emmaButton = document.getElementById('tutorial-emma');
    this.emmaCircle = document.getElementById('tutorial-emma-circle');
    this.specButton = document.getElementById('tutorial-spectateur');
    this.solvejButton = document.getElementById('tutorial-solvej');
    this.solvejCircle = document.getElementById('tutorial-solvej-circle');
  }
  play(){
    this.tl.play();
  }
  pause(){
    this.tl.pause();
  }
  start(){
    let onShadow = "0 0 50px rgba(11, 115, 129, 0.8)";
    let offShadow = "0 0 50px rgba(10, 84, 90, 0.5)";

    // INIT
    this.tl.from(this.overlay, .01, {opacity: 0});
    this.tl.from(this.title, .01, {opacity: 0, marginTop: 12}, "-=0.01");
    //buttons
    this.tl.from(this.emmaButton, .01, {opacity: 0, boxShadow: offShadow}, "-=0.01");
    this.tl.from(this.solvejButton, .01, {opacity: 0, boxShadow: offShadow}, "-=0.01");
    this.tl.from(this.specButton, .01, {opacity: 1, boxShadow: onShadow}, "-=0.01");
    //circles
    this.tl.from(this.solvejCircle, .01, {opacity: 0}, "-=0.01");
    this.tl.from(this.emmaCircle, .01, {opacity: 0}, "-=0.01");

    //FIRST MAIN
    this.tl.to(this.overlay, 1, {opacity: 1}, "+=1.5");
    this.tl.to(this.title, .5, {opacity: 1, marginTop: 35}, "-=1.5");
    // this.tl.to(this.title, .2, {})

    // EMMA CLIC


    //solvej clic

    //end
    this.tl.to(this.overlay, 1, {opacity: 0}, "+=7");
  }
  moveTo(frame: number){
    this.tl.progress((frame - this.params.start) / this.params.duration)
  }
}