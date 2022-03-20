import React from 'react'

const Posts = ({posts}) => (
  posts.map((item, idx) => (
    item.hasOwnProperty('apply_url') ? 

      <div className="card my-3 p-2 post" key={idx}>
        <div className="card-body">
          <img className="img-fluid rounded mb-3" src={item.company_logo} alt={item.company} width="100"/>
          <p className="large">
            <b>{item.position}</b>
          </p>
          <p>{item.location}</p>
          <a className="btn btn-primary" href={item.apply_url} target="_blank" rel="noreferrer">Apply</a>
        </div>
      </div>

    :

      <div className="card my-3 p-2 post" key={idx}>
        <div className="card-body">
          <img className="img-fluid rounded mb-3" src={item.company_logo} alt={item.company_name} width="100"/>
          <p className="large">
            <b>{item.title}</b>
          </p>
          <p>{item.candidate_required_location}</p>
          <a className="btn btn-primary" href={item.url} target="_blank" rel="noreferrer">Apply</a>
        </div>
      </div>

  ))
)

export default Posts
