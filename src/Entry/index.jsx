import React from 'react';
import { Link, Outlet } from "react-router-dom";
import routes from '../router'
import './index.scss'

function Entry() {
  return (
    <div className="entry">
      <nav>
        {
          routes.map(({ path, name }, index) => (
            <Link to={path} key={index}>{name}</Link>
          ))
        }
      </nav>
      <Outlet />
    </div>
  );
}

export default Entry;
