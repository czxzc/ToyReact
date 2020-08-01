import {ToyReact, Component} from './ToyReact';

class MyComponent extends Component{
  render(){
    return (
      <div name="a" id="ida">
        <span>hello</span>
        <span>world</span>
        <div>
          {true}
          {this.children}
        </div>
      </div>
    )
  }
}

let a= (
  <MyComponent name="a" id="ida">
    <div>hi</div>
  </MyComponent>
)

console.log(a);

ToyReact.render(a, document.body);



/**
var a = ToyReact.createElement("div", 
{
  name: "a"
}, 
ToyReact.createElement("span", null, "1"), 
ToyReact.createElement("span", null, "2"), 
ToyReact.createElement("span", null, "3"));
 */