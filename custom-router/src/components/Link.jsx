import * as React from 'react'
import history from '../services/history'
import qs from 'qs'
import classnames from 'classnames'
import { matchHref, RouterContext } from '../utils'

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export default class Link extends React.PureComponent {
  click = (event) => {
    const { onClick, target, replace, to } = this.props
    onClick && onClick()
    if (!event.defaultPrevented // onClick prevented default
      && event.button === 0 // ignore everything but left clicks
      && (!target || target === '_self') // let browser handle "target=_blank" etc.
      && !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault()
      to && history[replace ? 'replace' : 'push'](to)
    }
  }

  render() {
    const {
      to, onClick, activeClassName, className, children,
      exact, replace, ...props
    } = this.props
    return (
      <RouterContext.Consumer>
        {({ location }) => {
          const href = (
            typeof to === 'object'
              ? history.createHref({ ...to, search: to.query ? `?${qs.stringify(to.query)}` : to.search })
              : to
          )

          return (
            <a
              href={href}
              className={classnames(
                className,
                matchHref(href, location, { end: exact }) && activeClassName,
              )}
              onClick={this.click}
              {...props}
            >
              {children}
            </a>
          )
        }}
      </RouterContext.Consumer>
    )
  }
}
