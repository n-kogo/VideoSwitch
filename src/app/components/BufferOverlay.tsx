import * as React from "react";

export class BufferOverlay extends React.Component<any, any>{
  constructor(props: any){
    super(props);
    this.state = {
      buffering: false
    }
  }
  render(){
    return (
      <div id="buffer-overlay" className={this.state.buffering ? '' : 'hide'}> </div>
    )
  }
  updateDisplay(state: boolean){
    this.setState({
      buffering: state
    })
  }
}