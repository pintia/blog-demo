import React from 'react'
import Link from '../components/Link'

export default ({ params: { id } }) => (
  <>
    <div className="topbar">
      <Link to={`/users/${id}?a=1`} activeClassName="active">{`/users/${id}?a=1`}</Link>
      <Link to={{ pathname: `/users/${id}`, query: { b: '1' } }} activeClassName="active">{`/users/${id}?b=1`}</Link>
      <Link to={`/users/${id}/blogs/xyz`} activeClassName="active">blog</Link>
    </div>
    <div key="body" className="body" style={{ background: 'grey' }}>
      {`User Page for User ${id}`}
    </div>
  </>
)