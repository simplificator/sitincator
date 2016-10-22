import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
  static props = {
    icon: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.handleClick(e);
  }

  render() {
    return (
      <button onClick={this.handleClick} className={`icon icon-${this.props.icon}`}></button>
    );
  }
}
