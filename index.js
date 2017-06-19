//Functional JS
//Core Functions =====================================
const pipe = (fn, ...fns) => (...args) =>
  fns.reduce((acc, fn) => fn(acc), fn(...args));

const compose = (...fns) => pipe(...fns.reverse());
const recursivePipe = (fn, ...fns) => (...args) =>
  !fns.length ? fn(...args) : pipe(...fns)(fn(...args));

//Examples =============================================
function addOne(x) {
  return x + 1;
}

function addTwo(x) {
  return x + 2;
}

function double(x) {
  return x * 2;
}

const pre = compose(addOne, addTwo, double);
const prePipe = pipe(addOne, addTwo, double);

//DOM Manipulation =====================================

function create(element) {
  const { document, parent, type, children = [], css = {} } = element;
  const node = document.createElement(type);

  for (let key in css) {
    node.style[key] = css[key];
  }
  children.forEach(child => domManip(update(child, { parent: node })));
  return update(element, { node });
}

function append({ document, parent, node, children, content, className }) {
  if (className) {
    node.classList.add(className);
  }
  if (typeof parent !== 'string') {
    if (parent === document) {
      parent.body.appendChild(node);
    } else {
      parent.appendChild(node);
    }
  } else {
    document.querySelector(`.${parent}`) ||
      document.querySelector(`#${parent}`).appendChild(node);
  }
  return {
    content,
    node
  };
}

function addContent({ node, content }) {
  if (content) {
    node.innerHTML += content;
  }
}

function createNode(type, parent, content, css, className, ...children) {
  if (!type) {
    return console.warn('You must declare a type');
  }
  if (!document) {
    console.warn("This isn't going to work");
  }
  return {
    document: document,
    type,
    parent,
    content,
    css,
    className,
    children
  };
}

//CSS ===============================================
const _showup = {
  backgroundColor: 'whitesmoke',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  alignContent: 'center',
  margin: '0.5em',
  width: '70%',
  height: '5em',
  color: 'black'
};

const _output = {
  width: '80%',
  height: 'auto',
  backgroundColor: 'palevioletred',
  display: 'flex',
  color: 'white',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '-1.5px 1.5px 0 grey, 2px 2px 0 grey',
  padding: '1em'
};

const _result = {
  fontSize: '2em',
  margin: '0.2em'
};
const _title = {
  margin: '0',
  textDecoration: 'underline'
};

function update(obj, keysToChange) {
  if (typeof keysToChange !== 'object') {
    return console.warn('Second argument should be an object');
  }
  return Object.assign({}, obj, keysToChange);
}

//==========================================================
// Components
//==========================================================

const content = `A functional programming playground`;

const title = createNode('h3', 'output', 'Compose', _title);

const secondTitle = update(title, { content: 'Pipe' });

const codeBlock = createNode('pre', 'results', pre, { fontSize: '1em' });

const codeBlockTwo = update(codeBlock, { content: prePipe });

const resultOne = createNode('p', 'output', pre(5), _result);

const resultTwo = update(resultOne, { content: prePipe(5) });

const showup = createNode('div', 'output', content, _showup);

const exampleOne = createNode(
  'div',
  'output',
  '',
  {},
  'results',
  title,
  codeBlock,
  resultOne
);

const exampleTwo = update(exampleOne, {
  children: [secondTitle, codeBlockTwo, resultTwo]
});

const output = createNode(
  'div',
  document,
  `<p>An experiment into DOM manipulation using functional programming</p>`,
  _output,
  'output',
  showup,
  exampleOne,
  exampleTwo
);

/* Alternate syntax for node creation
 *const output = {
 *  document: document,
 *  parent: document,
 *  type: 'div',
 *  className: 'output',
 *  css: _output,
 *  children: [showup, exampleOne, exampleTwo]
 *};
 */

//INIT APP =================================================

const domManip = compose(addContent, append, create);
domManip(output);
