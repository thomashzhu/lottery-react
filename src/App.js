import React, { Component } from 'react';

import './App.css';
import web3 from './ethereum/web3';
import lottery from './ethereum/contracts/lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    /* eslint-disable react/no-did-mount-set-state  */
    this.setState({ manager, players, balance });
    /* eslint-enable react/no-did-mount-set-state  */
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ message: 'Waiting on transaction success...' });

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    this.setState({ message: 'Waiting on transaction success...' });

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    const winner = await lottery.methods.winner().call();
    
    this.setState({ message: `The winner is ${winner}.` });
  };

  render() {
    const {
      manager, players, balance, value, message,
    } = this.state;

    return (
      <div>
        <h2>Lottery Contract</h2>

        <p>
          This contract is managed by {manager}.
          There are currently {players.length} people entered,
          competing to win {web3.utils.fromWei(balance, 'ether')} ether!
        </p>

        <hr />
        
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label htmlFor="value">
              Amount of ether to enter
              <input
                id="value"
                onChange={event => this.setState({ value: event.target.value })}
                value={value}
              />
            </label>
          </div>
          <button>Enter</button>
        </form>
        
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>
          Pick a winner!
        </button>

        <hr />

        <h1>{message}</h1>
      </div>
    );
  }
}

export default App;
