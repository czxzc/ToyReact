const isArray = (val) => Object.prototype.toString.apply(val) === "[object Array]";
const isObject = (val) => Object.prototype.toString.apply(val) === "[object Object]";

const createRange = (element) => {
  let range = document.createRange();
  if (element.children.length) {
    range.setStartAfter(element.lastChild);
    range.setEndAfter(element.lastChild);
  } else {
    range.setStart(element, 0);
    range.setEnd(element, 0);
  }
  return range;
}

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      // 有些事件名称中是有大写字母的，所以不能直接调用RegExp.$1.toLowerCase
      let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
      this.root.addEventListener(eventName, value);
    }
    if (name === 'className') {
      name = 'class';
    }
    this.root.setAttribute(name, value);
  }
  appendChild(vchild) {
    const range = createRange(this.root);
    vchild.mountTo(range);
  }

  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }

  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}


export let ToyReact = {
  createElement(type, attributes, ...children) {
    let element;
    if (typeof type === 'string')
      element = new ElementWrapper(type);
    else
      element = new type();
    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }
    let insertChildren = (children) => {
      for (let child of children) {

        if (isArray(child)) {
          insertChildren(child);
        } else {
          if (!(child instanceof Component) &&
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper)) {
            child = String(child);
          }
          if (typeof child === 'string') {
            child = new TextWrapper(child);
          }
          element.appendChild(child);
        }
      }
    }

    insertChildren(children);

    return element;
  },

  // 将vdom变成实dom
  render(vdom, element) {
    let range = createRange(element);
    vdom.mountTo(range);
  }
}

export class Component {
  constructor() {
    this.children = [];
    this.props = Object.create(null);
  }

  setAttribute(name, value) {
    this.props[name] = value;
    this[name] = value;
  }

  mountTo(range) {
    this.range = range;
    this.update();
  }

  update() {
    this.range.deleteContents();
    let vdom = this.render();
    vdom.mountTo(this.range);
  }

  appendChild(vchild) {
    this.children.push(vchild);
  }

  setState(state) {
    let merge = (oldState, newState) => {
      for (let p in newState) {
        if (isArray(newState[p]) && !isArray(oldState[p])) {
          oldState[p] = [];
          merge(oldState[p], newState[p]);
        }
        if (isObject(newState[p]) && !isObject(oldState[p])) {
          oldState[p] = {};
          merge(oldState[p], newState[p]);
        }
        oldState[p] = newState[p];
      }
    }
    if (!this.state && state) {
      this.state = {};
    }
    merge(this.state, state);
    this.update();
  }
}