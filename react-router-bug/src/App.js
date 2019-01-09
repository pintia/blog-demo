import React, { Component } from 'react'
import './App.css'
import { browserHistory, Route, Router } from 'react-router'

class App extends Component {
  componentDidMount() {
    browserHistory.push('/1')
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <a onClick={() => browserHistory.push('/1')}>/1</a>
          <a onClick={() => browserHistory.push('/2')}>/2</a>
          <a onClick={() => browserHistory.push('/3')}>/3</a>
        </div>
        <div className="App-body">
          <Router history={browserHistory}>
            <Route path="/">
              <Route path="/1" getComponent={(nextState, cb) => {
                setTimeout(() => cb(null, () => '1'), 1000)
              }} />
              <Route path="/2" getComponent={(nextState, cb) => {
                setTimeout(() => cb(null, () => '2'), 2000)
              }} />
              <Route path="/3" getComponent={(nextState, cb) => {
                setTimeout(() => cb(null, () => '3'), 3000)
              }} />
            </Route>
          </Router>
        </div>
      </div>
    )
  }
}

export default App
