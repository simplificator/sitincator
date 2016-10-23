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
    this.state = {
      clicked: false,
    };
  }

  handleClick(e) {
    this.setState({ clicked: true });
    this.clickedTimer = setTimeout(
      () => this.setState({ clicked: false }),
      1000
    );
    this.props.handleClick(e);
  }

  componentWillUnmount() {
    clearTimeout(this.clickedTimer);
  }

  render() {
    const iconClasses = classNames('icon', `icon-${this.props.icon}`);
    const btnClasses = classNames({
      clicked: this.state.clicked,
    }, this.props.className);

    return (
      <button onClick={this.handleClick} className={btnClasses} disabled={this.state.clicked}>
        <i className={iconClasses}></i>
      </button>
    );
  }
}
