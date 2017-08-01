import * as React from "react";
import '../../styles/style_intro.scss';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
  video: HTMLVideoElement;
  render() {
    return (
      <div className="home">
        <div className="shader">
          <video id="background-video" autoPlay loop>
            <source src="assets/videos/boucle_intro.mp4" type="video/mp4" />
          </video>
          <div className="content">
            <h1 className="titre">Le Refuge des Souvenirs</h1>
            <h2 className="sous-titre">Court-métrage d'animation interactif</h2>
            <div className="home-container">
              <Link to="/film" className="button-start">Jouer le film</Link>
              <div className="home-description">
                <h3>Une histoire, trois visions:</h3>
                <p>Solvej et Emma sont amies d'enfance.</p>
                <p>Elles se retrouvent quelques années plus tard dans la cabane de leurs années de jeunesse. Seulement, elles ont désormais une vision différente de leur amitié.</p>
              </div>
              <div className="footer">
                Lyne HEHLEN | EMCA 2017
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(){
    console.log('mount complete')
    var CST = {
      VIDEO_RATIO: 2200 / 1080,
    };
    let video= document.getElementById('background-video') as HTMLVideoElement;
    function resize(){
      var width, height, mtop, mleft;
      if(window.innerWidth / CST.VIDEO_RATIO <= window.innerHeight){
        width = window.innerWidth;
        height = window.innerWidth / CST.VIDEO_RATIO;
        mtop = (window.innerHeight - height) / 2;
        mleft = 0;
      }
      else {
        width = window.innerHeight * CST.VIDEO_RATIO;
        height = window.innerHeight;
        mtop = 0;
        mleft = (window.innerWidth - width) / 2;
      }
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      video.parentElement.style.width =  width;
      video.parentElement.style.height =  height;
      video.parentElement.style.top = mtop + "px";
      video.parentElement.style.left = mleft + "px";
    }
    if (video){
      video.volume = 0;
      resize();
      window.onresize = resize;
    }
  }
}