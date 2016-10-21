require('../static/sass/main.scss');

var React = require('react');
var ReactDom = require('react-dom');

var App = React.createClass({
  render: function() {
    return <h1>Hello from React and Manuel and Marcus!</h1>;
  }
});

ReactDom.render(<App/>, document.getElementById('react-root'));
