import React from 'react'
import Link from '../components/Link'

export default () => (
  <>
    <div className="topbar">
      <Link to="/#1" activeClassName="active">#1</Link>
      <Link to="/?a=123" activeClassName="active">?a=123</Link>
      <Link to="/?a=123&b=456" activeClassName="active">?a=123&b=456</Link>
    </div>
    <div key="body" className="body" style={{ background: 'red' }}>
      Home Page
    </div>
  </>
)