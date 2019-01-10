import createBrowserHistory from 'history/createBrowserHistory'
import qs from 'qs'

const enhanceLocation = location => ({
  ...location,
  query: qs.parse(location.search.substr(1)),
})

const enhanceMethod = f => (to, state) => {
  if (to && to.query) {
    return f({
      ...to,
      search: `?${qs.stringify(to.query)}`,
    })
  }
  return f(to, state)
}

const history = createBrowserHistory()

const enhancedHistory = { ...history }

enhancedHistory.listen = handle => history.listen((location, action) => {
  enhancedHistory.location = enhanceLocation(history.location)
  enhancedHistory.length = history.length
  return handle(enhanceLocation(location), action)
})

enhancedHistory.push = enhanceMethod(history.push)
enhancedHistory.replace = enhanceMethod(history.replace)
enhancedHistory.location = enhanceLocation(history.location)

export default enhancedHistory
