import React, { Component } from 'react';
import Button from './button';


export default class Status extends Component {
  handleClick() {
    console.log('Button clicked');
  }

  render() {
    return ( 
      <div>
        <h3>Status</h3>
        <Button icon="15-min" handleClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}
