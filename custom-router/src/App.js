import React from 'react'
import { flattenRoutes, } from './utils'
import history from './services/history'
import Router from './components/Router'
import './App.css'

const routes = flattenRoutes({
  '': 'HomePage',
  'admin': 'AdminPage',
  'home': 'HomePage',
  'users': {
    ':id': {
      '': 'UserPage',
      'blogs/:blogId': 'BlogPage',
    },
  },
  'error': 'NoImplementPage',
})

export default () => (
  <div className="App">
    <div className="sidebar">
      {['/', '/home', '/admin', '/users/1', '/users/2?a=1', '/users/2?b=2&a=1', '/users/2/blogs/xyz', '/404', '/error']
        .map(s => <a key={s} onClick={() => history.push(s)}>{s}</a>)
      }
    </div>
    <div className="main">
      <Router history={history} routes={routes} />
    </div>
  </div>
)
