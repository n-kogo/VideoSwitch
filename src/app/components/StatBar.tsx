import * as React from "react";
import {PoVValues} from "../interfaces/PoV";

export class StatBar extends React.Component<{stats: PoVValues}, PoVValues>{
  constructor(props: any){
    super(props);
    this.state = {
      emma: props.stats.emma,
      neutre: props.stats.neutre,
      solvej: props.stats.solvej
    }
  }
  render(){
    return (
      <div className="stat-bar">
        <div className="stat-bar__wrapper">
          <div className="stat-bar__inner emma" style={{width: this.state.emma + '%'}}></div>
          <div className="stat-bar__inner neutre" style={{width: this.state.neutre + '%'}}></div>
          <div className="stat-bar__inner solvej" style={{width: this.state.solvej + '%'}}></div>
        </div>
        <div className="stat-bar__legend">
          <div className="stat-bar__legend-unit emma" >
            <div className="stat-bar__name">EMMA</div>
            <div className="stat-bar__percent">{this.state.emma + '%'}</div>
          </div>
          <div className="stat-bar__legend-unit neutre">
            <div className="stat-bar__name">NEUTRE</div>
            <div className="stat-bar__percent">{this.state.neutre + '%'}</div>
          </div>
          <div className="stat-bar__legend-unit solvej">
            <div className="stat-bar__name">SOLVEJ</div>
            <div className="stat-bar__percent">{this.state.solvej + '%'}</div>
          </div>
        </div>
      </div>

    )
  }
}