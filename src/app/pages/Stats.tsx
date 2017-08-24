import * as React from "react";
import axios, {AxiosResponse} from 'axios';
import {StatBar} from "../components/StatBar";
import {PoVValues} from "../interfaces/PoV";
import { Link } from 'react-router-dom';

interface StatsState{
  major: string,
  myStats: PoVValues | null,
  globalStats: PoVValues | null
}

export class Stats extends React.Component<any, StatsState>{
  constructor(props: any){
    super(props);
    let myStats:any = JSON.parse(window.localStorage.getItem('video-stat'));
    let major;
    if(myStats.emma >= myStats.solvej && myStats.emma >= myStats.neutre){
      major = 'emma';
    }
    else if (myStats.neutre >= myStats.solvej && myStats.neutre >= myStats.emma){
      major = 'neutre';
    }

    else if (myStats.solvej >= myStats.neutre && myStats.solvej >= myStats.emma){
      major = 'solvej';
    }
    this.state = {
      major: major,
      myStats: myStats,
      globalStats: null
    };
  }
  render(){
    // console.log(this.state);
    const global = this.state.globalStats ?
      <div className="stats__bloc">
        <h2 className="stats__title">L'expérience des autres spectateurs</h2>
        <StatBar stats={this.state.globalStats}/>
      </div>
    :
      <h3 className="stats__info"> Loading ...</h3>;

    const mine = this.state.myStats ?
      <span>
        <h1>
          Vous avez davantage regardé la vision
          <span className={this.state.major}> {this.state.major}</span>
        </h1>
        <h2 className="stats__title">Votre expérience</h2>
        <StatBar stats={this.state.myStats}/>
      </span>
    :
      <span>
        <h1>Statistiques</h1>
        <h3 className="stats__info">Vous n'avez pas encore joué le film..</h3>
      </span>
    return (
      <div className="stats">
        <div className="stats__content">
          {mine}
          {global}
          <Link to="/" className={'stats__button ' + this.state.major}>Retour à l'accueil</Link>
        </div>
      </div>
    )
  }
  componentDidMount(){
    this.fetchStats();
  }
  fetchStats(){
    return axios.get(STATS_URL).then((res: AxiosResponse)=>{
      this.setState({
        globalStats: res.data
      })
    });
  }
}