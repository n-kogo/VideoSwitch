import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom';
import {Home} from "./app/pages/Home";
import {Film} from "./app/pages/Film";
import {App} from "./app/pages/App";
import {Credits} from "./app/pages/Credits";
import { Link } from 'react-router-dom';
import {MakingOf} from "./app/pages/MakingOf";
import {Stats} from "./app/pages/Stats";
import {Redirect} from "react-router";




class Navigation extends React.Component{
  render(){
    return (
      <div className="navigation">
        <div className="navigation__shader">
          <video id="background-video" autoPlay loop>
          </video>
          <div className="navigation__content">
            {this.props.children}
          </div>
        </div>
        <div id="footer" className="navigation__footer">
          <Link to="/" className="navigation__element">ACCUEIL</Link>
          <Link to="/film" className="navigation__element">FILM</Link>
          <Link to="/credits" className="navigation__element">CRÉDITS</Link>
          <Link to="/making-of" className="navigation__element">MAKING-OF</Link>
          <a href="https://www.instagram.com/ly__boo" target="_blank" rel="nofollower noopener" className="navigation__external">
            <img src="./assets/icons/instagram.png" alt="instagram"/>
          </a>
          <a href="https://twitter.com/ly__Boo" target="_blank" rel="nofollower noopener" className="navigation__external">
            <img src="./assets/icons/twitter.png" alt="Twitter"/>
          </a>
          <a href="https://www.linkedin.com/in/lyne-hehlen/" target="_blank" rel="nofollower noopener" className="navigation__external">
            <img src="./assets/icons/linkedin.png" alt="LinkedIn"/>
          </a>
        </div>
      </div>
    )
  }
  componentDidMount(){
    // console.log('mount complete')
    var CST = {
      VIDEO_RATIO: 2200 / 1080,
    };
    let width = window.innerWidth;
    if(width > 1600){
      width = 1920;
    }
    else if (width > 1000) {
      width = 1280
    }
    else {
      width = 853
    }
    let video= document.getElementById('background-video') as HTMLVideoElement;
    video.src= "./assets/videos/"+width+"/boucle_intro.mp4";
    video.load();
    function resize(){
      var width, height, mtop, mleft;
      if(window.innerWidth / CST.VIDEO_RATIO <= window.innerHeight){
        width = window.innerHeight * CST.VIDEO_RATIO;
        height = window.innerHeight;
        mtop = 0;
        mleft = (window.innerWidth - width) / 2;
      }
      else {
        width = window.innerWidth;
        height = window.innerWidth / CST.VIDEO_RATIO;
        mtop = (window.innerHeight - height) / 2;
        mleft = 0;
      }
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      // video.parentElement.style.width =  width;
      // video.parentElement.style.height =  height;
      // video.parentElement.style.top = mtop + "px";
      // video.parentElement.style.left = mleft + "px";
    }
    if (video){
      video.volume = 0;
      resize();
      window.onresize = resize;
    }
  }
}

ReactDOM.render(
  <div>
    <BrowserRouter>
      <Switch>
        <Route path="/film" component={Film} />
        <Navigation>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/app" component={App} />
            <Route path="/stats" component={Stats} />
            <Route path="/credits" component={Credits}/>
            <Route path="/making-of" component={MakingOf}/>
            <Redirect to="/" />
          </Switch>

        </Navigation>
      </Switch>

    </BrowserRouter>
  </div>
  ,document.getElementById('root')
);
