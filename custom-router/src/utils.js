import * as React from 'react'
import pathToRegexp from 'path-to-regexp'
import fromPairs from 'lodash/fromPairs'
import flatten from 'lodash/flatten'
import qs from 'qs'

export const matchPath = (path, pathname, options) => {
  const keys = []
  const result = pathToRegexp(path, keys, options).exec(pathname)
  return result
    && fromPairs(keys.map(({ name }, i) => [name, result[i + 1]]))
}

export const flattenRoutes = (config, path = '') => (
  typeof config === 'string'
    ? [{ path: path || '/', name: config }]
    : flatten(Object.entries(config)
      .sort(([key1], [key2]) => key2.length - key1.length)
      .map(([key, value]) => flattenRoutes(value, `${path}${key ? `/${key}` : ''}`)))
)

export const matchHref = (href, location, options) => {
  const [, pathname = '/', queryString = '', hash = ''] = (
    href.match(/^([^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/) || [])
  return (
    matchPath(pathname, location.pathname, options)
    && Object.entries(qs.parse(queryString))
      .every(([key, value]) => location.query[key] === value)
    && hash === location.hash.substr(1)
  )
}

export const RouterContext = React.createContext({})