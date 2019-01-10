import * as React from 'react'
import resolve from '../decorators/resolve'
import LoadingBar from './LoadingBar/LoadingBar'
import history from '../services/history'
import { RouterContext } from '../utils'

const timeout = ms => data => new Promise(resolve => setTimeout(resolve, ms, data))

export default resolve(
  ({ name, ...match }) => import(`../pages/${name}`)
    .then(timeout(500)) // for demo
    .then(module => (
      <RouterContext.Provider value={match}>
        {module.default(match)}
      </RouterContext.Provider>
    )),
  { key: ['location.pathname', 'location.search'] },
)(({ data, loading, error }) => (
  <>
    <LoadingBar key={history.location.pathname + history.location.search} loading={loading} />
    {error ? error.toString() : data}
  </>
))

