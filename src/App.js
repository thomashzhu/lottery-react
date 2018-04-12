import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import web3 from './ethereum/web3';
import lottery from './ethereum/contracts/lottery';

class App extends Component {
  state = {
    manager: '',
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    this.setState({ manager });
  }

  render() {
    const { manager } = this.state;
    
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {manager}</p>
      </div>
    );
  }
}

export default App;
