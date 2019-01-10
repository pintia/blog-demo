import React, { Component } from 'react'
import Page from './Page'
import { matchPath } from '../utils'

export default class Router extends Component {
  getPage = (location) => {
    const route = this.props.routes.find(r => matchPath(r.path, location.pathname))
    return (
      route
        ? <Page
          name={route.name}
          params={matchPath(route.path, location.pathname)}
          location={location}
        />
        : <div>404 NotFound</div> // 404
    )
  }

  state = { page: this.getPage(this.props.history.location) }

  componentDidMount() {
    this.unListen = this.props.history.listen(location => this.setState({
      page: this.getPage(location),
    }))
  }

  componentWillUnmount() {
    this.unListen()
  }

  render() {
    return this.state.page
  }
}
