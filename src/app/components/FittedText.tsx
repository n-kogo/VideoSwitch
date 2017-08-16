
import * as React from "react";

export class FittedText extends React.Component<any, any> {
  constructor(props){
    super(props);
    this.state = {
      text: props.content,
      type: props.type || 'h2'
    }
  }
  render(){
    let arr = [];
    for(let i = 0; i < this.state.text.length; i++){
      arr.push(<span key={i} className={this.state.text[i]===" " ? "fitted-text__space" : ""}>{this.state.text[i]}</span>)
    }
    if(this.state.type === 'h1'){
      return <h1 className="fitted-text">{arr}</h1>
    }

    if(this.state.type === 'h2'){
      return <h2 className="fitted-text">{arr}</h2>
    }
    if(this.state.type === 'h3'){
      return <h3 className="fitted-text">{arr}</h3>
    }
  }
}