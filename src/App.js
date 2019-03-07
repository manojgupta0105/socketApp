import React, { Component } from 'react';
// import io from 'socket.io-client';
import Websocket from 'react-websocket';
// import _ from 'lodash';
// import logo from './logo.svg';
import moment from 'moment';
import './App.css';

const serverUrl = "ws://stocks.mnet.website/";
// const socket = io(serverUrl);
// const socket = io(socketProtocol, { transports: ['websocket'] });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockData: {},
    };
  }

  timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  handleData(data) {
    const stockData = JSON.parse(JSON.stringify(this.state.stockData));
    console.log(data);

    JSON.parse(data).forEach((stockItem) => {
      let itemStatus = 0;
      console.log();
      if(stockData[stockItem[0]]) {
        if(stockItem[1] - stockData[stockItem[0]].value === 0) {
          itemStatus = 0;
        } else if(stockItem[1] - stockData[stockItem[0]].value > 0) {
          itemStatus = 1;
        } else {
          itemStatus = -1;
        }
      }

      if(!stockData[stockItem[0]]) {
        stockData[stockItem[0]] = {};
      }
      stockData[stockItem[0]].name = stockItem[0];
      stockData[stockItem[0]].value = stockItem[1];
      stockData[stockItem[0]].status = itemStatus;
      stockData[stockItem[0]].timeAgo = moment().diff(stockData[stockItem[0]].timeStamp, 'seconds');
      stockData[stockItem[0]].timeStamp = moment();
    });

    this.setState({stockData});
  }
  render() {
    const {stockData} = this.state;
    const stockDataKeys = Object.keys(stockData);
    console.log('stockData ', stockData);
    return (
      <div className="App">
        <header className="App-header">
            <table border="1">
              <thead>
              <tr>
                <th>Product</th>
                <th>Value</th>
                <th>Update Status</th>
              </tr>
              </thead>
              <tbody>
              {stockDataKeys.map((item) => {
                return (<tr>
                  <td>{stockData[item].name}</td>
                  <td style={{background: `${stockData[item].status === 0 ? 'transparent' : (stockData[item].status === -1 ? 'red' : 'green')}`}}>{stockData[item].value}</td>
                  <td>{stockData[item].timeAgo} seconds ago</td>
                </tr>);
              })}
              </tbody>
            </table>
          <Websocket url={serverUrl}
              onMessage={this.handleData.bind(this)}/>
        </header>
      </div>
    );
  }
}

export default App;
