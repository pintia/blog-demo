import React from 'react'
import Link from '../components/Link'

export default ({ params: { id, blogId } }) => (
  <>
    <div className="topbar">
      <Link to={`/users/${id}`} activeClassName="active">user</Link>
    </div>
    <div key="body" className="body" style={{ background: 'grey', fontSize: 32, padding: 32 }}>
      {`User Blog Page for User ${id}`}
    </div>
    <div className="body fadeIn" style={{ background: 'green' }}>
      {`Blog Content for ${blogId}`}
    </div>
  </>
)