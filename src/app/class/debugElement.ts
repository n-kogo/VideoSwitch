export class DebugElement {
  bloc: HTMLElement;
  element: HTMLElement;
  parent: HTMLElement;
  constructor(public name: string, private updateFn: ()=> string | number){
    this.name = 'debug-' + this.name;
    this.parent = document.getElementById('debug-container');
    let para = document.createElement('p');
    para.id = this.name;
    let b = document.createElement('b');
    b.innerHTML = this.name.replace('debug-', '').replace('-', ' ');
    let span = document.createElement('span');
    span.id = this.name + '-value';
    para.appendChild(b);
    para.appendChild(span);
    this.parent.appendChild(para);
    this.bloc = para;
    this.element = span;
  }

  update(){
    let content = this.updateFn();
    if(typeof content === 'number'){
      content = content.toFixed(2);
    }
    this.element.innerHTML = <string> content;
  }
}