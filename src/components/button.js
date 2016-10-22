import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

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
    const buttonClassNames = ['icon', `icon-${this.props.icon}`, this.props.className];

    return (
      <button onClick={this.handleClick} className={classNames(buttonClassNames)}></button>
    );
  }
}
