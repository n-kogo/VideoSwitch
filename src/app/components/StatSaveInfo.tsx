import * as React from "react";
import axios, {AxiosResponse} from 'axios';
import {ViewinRange} from "../VideoApp";

interface StatSaveInfoState{
  statInfo: 'hidden' | 'loading' | 'finished' | 'errored'
}

export class StatSaveInfo extends React.Component<any, StatSaveInfoState>{
  saving : boolean = false;
  constructor(props: any){
    super(props);
    this.state = {
      statInfo : 'hidden'
    }
  }
  render(){
    let statText;
    switch(this.state.statInfo){
      case 'hidden':
        statText= "Film en cours...";
        break;
      case 'loading':
        statText = "Sauvegarde des statistiques en cours...";
        break;
      case 'finished':
        statText = "Sauvegarde terminée. Veuillez attendre la fin des crédits.";
        break;
      case 'errored':
        statText = "La sauvegarde a echoué.";
    }
    return (
      <div className={"stat-info stat-info__" + this.state.statInfo}>
        {statText}
      </div>
    )
  }

  startSave(data: Array<ViewinRange>){
    // console.log(data, 'start save');
    this.saving = true;
    this.setState({
      statInfo: 'loading'
    });
    axios.post(STATS_URL, {ranges: data}, {}).then((d)=> this.onSaveComplete(d), (d)=> this.onError(d));
  }

  onSaveComplete(response: AxiosResponse){
    // console.log('save complete')
    if(response.status == 200){
      window.localStorage.setItem('video-stat', JSON.stringify(response.data.percents));
      setTimeout(()=>{
        this.setState({
          statInfo: 'finished'
        })
      }, 1000);

    }
    else{
      console.error('[onSaveComplete]: ' + response.statusText);
      this.setState({
        statInfo: 'errored'
      });
    }
  }
  onError(response: AxiosResponse){
    console.error('[onSaveComplete]: ' + response.statusText);
    this.setState({
      statInfo: 'errored'
    });

  }
}