import React from 'react';


function currentHash() {
  return window.location.hash;
}

function isStatusView() {
  return /status/.test(currentHash());
}

const App = React.createClass({
  componentDidMount: function() {
    window.location.hash = 'status';
  },

  handleFooterClick() {
    window.location.hash = isStatusView() ? 'schedule' : 'status';
  },

  render: function() {
    const footerText = isStatusView() ?
      <span>full schedule <i className="icon icon-arrow-right"></i></span> :
      <span><i className="icon icon-arrow-left"></i> back to booking</span>;
    return (
      <div id="app">
        {this.props.children}
        <footer>
          <div className="footer">
            <a onClick={this.handleFooterClick}>{footerText}</a>
          </div>
        </footer>
      </div>
    )
  }
});

export default App;
