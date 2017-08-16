import * as React from "react";

interface CreditCat {
  title: string;
  links: Array<{
    name: string;
    link?: string;
  }>;
}

export class Credits extends React.Component{
  data: Array<CreditCat> = [
    {
      title: "REALISATION",
      links: [
        {
          name:"Lyne HEHLEN",
          link: "http://ly-boo.tumblr.com/"
        }
      ]
    },
    {
      title: "DEVELOPPEUR WEB",
      links: [
        {
          name: "Thibaut CARCENAC",
          link: "http://www.tibold.fr/"
        }
      ]
    },
    {
      title: "MUSIQUE ORIGINALE",
      links: [
        {
          name: "Pierre FEYFANT",
          link: "http://www.pierrefeyfantcompositeur.com/"
        }
      ]
    },
    {
      title: "TUTRICE DE PROJET",
      links : [
        {
          name: "Joanna LURIE",
          link: "http://joannalurie.com/"
        }
      ]
    },

    {
      title: "AIDE ANIMATION 2D",
      links : [
        {
          name: "Emilie NAKHLÉ",
          link: "http://emilie-nk.tumblr.com/"
        },
        {
          name: "Julie CHEA",
          link: "http://daravanchea.tumblr.com/"
        },
        {
          name: "Virgnie COSTA",
          link: "https://virginiecosta.tumblr.com/"
        }
      ]
    },
    {
      title: "AIDE SET-UP",
      links: [
        {
          name: "Renaud FARLOTTI",
          link: "http://renaud-farlotti.tumblr.com/"
        }
      ]
    },
    {
      title: "VOIX",
      links: [
        {
          name: "Stella JAIMOND",
          link: "http://red-volver.tumblr.com/"
        },
        {
          name: "Florine PAULIUS",
          link: "https://vimeo.com/user25846381"
        },
        {
          name: "Noéline CARCENAC"
        },
        {
          name: "Mathilde CARMES",
          link: "https://www.youtube.com/user/MadStalker0"
        },
        {
          name :"Inès AZMA",
          link: "https://www.youtube.com/channel/UCXko9Z6azezfSTTzMPSiHTw"
        }
      ]
    },
    {
      title: "MIXAGE",
      links: [
        {
          name: "Renaud DENIS"
        }
      ]
    }
  ];
  render(){
    let credits = this.data.map((cat)=>{
      let people = cat.links.map((person)=>{
        if(person.link){
          return (
            <a href={person.link} target="_blank" className="credits__link">{person.name}</a>
          )
        }
        else {
          return (
            <div className="credits__link">{person.name}</div>
          )
        }

      });
      return(
        <div>
          <h2>{cat.title}</h2>
          <div className="credits__people">{people}</div>
        </div>
      )
    });
    return (
      <div className="credits">
        {credits}
      </div>
    )
  }
}