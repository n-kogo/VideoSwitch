import * as React from "react";
import '../../styles/style_intro.scss';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
  video: HTMLVideoElement;
  render() {
    return (
      <div className="home">
        <div className="home__content">
          <h1 className="titre">Le Refuge des Souvenirs</h1>
          <h2 className="sous-titre">Court-métrage d'animation interactif</h2>
          <div className="home-container">
            <Link to="/film" className="button-start">Jouer le film</Link>
            <div className="home-description">
              <h3>Une histoire, trois visions:</h3>
              <p>Solvej et Emma sont amies d'enfance.</p>
              <p>Elles se retrouvent quelques années plus tard dans la cabane de leurs années de jeunesse. Seulement, elles ont désormais une vision différente de leur amitié.</p>
            </div>
            <div className="home__info">Pour profiter au mieux de l'expérience, il est conseillé de regarder ce court-métrage avec une connexion stable, et avec le navigateur Google Chrome (ou Mozilla Firefox).</div>
            {/*<div className="home__footer">*/}
              {/*Lyne HEHLEN | EMCA 2017*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    )
  }
}