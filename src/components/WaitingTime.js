import React from 'react';

export default props => {
  let { waitingTime } = props;
  const hours = Math.floor(waitingTime / 3600);
  waitingTime = waitingTime - hours * 3600;
  const minutes = Math.floor(waitingTime / 60);
  const seconds = waitingTime - minutes * 60;

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card text-center timer">
          <i className="material-icons large">access_time</i>
          <div className="card-body">
            <h5 className="card-title">Waiting Time...</h5>
          </div>
          <div className="card-footer text-muted">
            <h1>
              {addZeroBefore(hours)}:{addZeroBefore(minutes)}:{addZeroBefore(seconds)}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

const addZeroBefore = n => (n < 10 ? '0' : '') + n;
