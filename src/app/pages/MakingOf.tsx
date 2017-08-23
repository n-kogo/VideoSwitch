import * as React from "react";
import Youtube from 'react-youtube';
import {FittedText} from "../components/FittedText";

export class MakingOf extends  React.Component {
  render() {
    let width = Math.min(window.innerWidth, 640);
    let height = width * 9 / 16
    return (
      <div className="making-of">
        <div className="making-of__video-container">
          {/*<iframe width="560" height="315" src="https://www.youtube.com/embed/C_lALZMOgh8"></iframe>*/}
          {/*<Iframe width="560" height="315" src="https://www.youtube.com/embed/C_lALZMOgh8" frameborder="0" allowfullscreen></Iframe>*/}
          <Youtube
            videoId="C_lALZMOgh8"
            opts={{width: width, height: height}}
          />
        </div>
        <div className="making-of__paragraph">
          <div className="making-of__titles">
            <FittedText type="h3" content="LE REFUGE DES SOUVENIRS"/>
            <FittedText type="h2" content="MAKING-OF"/>
          </div>
          <p>« Le Refuge des Souvenirs » est un projet réalisé dans le cadre de ma dernière année d’étude à l’EMCA. C’était une très chouette expérience que de me lancer dans un projet comme celui-ci. J’avais beaucoup d’idées en tête avant de commencer à écrire l’histoire. Notamment l’envie de travailler sur un projet interactif destiné au web, mais aussi de faire un film centré sur la relation entre deux personnages dans un espace intime et clos. Le concept du switch entre les sentiments de chaque personnage était un bon compromis pour moi. J’avais, comme référence principale, « WIE or DIE »,qui propose un court métrage web où le principe est de changer à tout moment de caméra dans l’histoire, et donc de pouvoir suivre une scène sous un autre angle, ou avec d’autres personnages.</p>
          <p>Une fois tout ça plus ou moins fixé, je me suis lancée sur le point de vue neutre ( que j’appelle aussi « point de vue cabane ») , qui deviendra ma référence pour les deux autres visions. Modélisation, texturing, rigging, photos du décor, animation puis compositing ont été mes occupations pendant plusieurs mois. Une fois terminé, j’ai décliné les personnages et les décors sur les deux autres points de vue. Celui de Solvej en animation digitale sur Photoshop et aux pastels pour les petites créatures qui l’accompagnent. Quand à celui d’ Emma, il a été animé en 2D traditionnelle aux pastels, fusains et crayons de couleurs. Une pensée et un grand merci à Julie, Virginie et Emilie qui m’ont aidée à faire prendre vie aux petites bestioles, et à animer un plan d’ Emma !</p>
          <br/>
          <p>Une fois l’image terminée, il fallait s’attaquer au son. La musique a été composée avec talent par Pierre FEYFANT, qui a très bien cerné l’univers et l’ambiance du film et de chaque point de vue. Il a donc composé trois thèmes pour chaque vision. J’étais très heureuse de travailler avec lui, merci encore ! Pour le sound design, j’ai commencé à travailler un peu de mon côté et j’ai ensuite été aidée par Renaud DENIS pour développer le tout et faire le mixage final.</p>
          <p>Le projet fini, Thibaut CARCENAC a élaboré le site final et l’application. Nous avions longuement réfléchi au système et au site. Je le remercie grandement pour son investissement sans faille tout au long du projet, et le développement qu’il a réalisé avec brio pour donner naissance à ce projet.</p>
          <p>J’espère que l’expérience vous aura plu, merci beaucoup de votre visionnage. A bientôt pour de nouvelles histoires!</p>
          <br/>
          <p className="signature-align">- Lyne HEHLEN</p>
       </div>
      </div>
    )
  }
}