import React from 'react';
export default props => {
  const { storeName, street } = props.storeDetail;
  return (
    <header>
      <nav className="navbar navbar-expand-lg ">
        <a className="navbar-brand">
          {storeName}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse">
          <span className="address">
            <i className="material-icons">location_on</i>{' '}
            <address>{street}</address>
          </span>
        </div>
      </nav>
    </header>
  );
};
