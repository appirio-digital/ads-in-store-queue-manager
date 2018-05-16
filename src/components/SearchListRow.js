import React from 'react';
import ReactMomentCountDown from 'react-moment-countdown';
import moment from 'moment-timezone';

export default props => {
  const {
    isBookedSlot,
    slotTime,
    store,
    appointmentType,
    appointmentStartTime
  } = props.storeItem;
  const { onBookAction, storeItem } = props;
  return (
    <div className="col-sm-6">
      <div className={isBookedSlot ? 'card bg-secondary text-white' : 'card'}>
        <div className="card-header">
          <h5>
            {store.name}
          </h5>
          {!isBookedSlot &&
            <button
              className="btn btn-primary btn-sm"
              onClick={onBookAction(storeItem)}
            >
              Book Now
            </button>}
          {isBookedSlot &&
            <span
              className="badge badge-pill badge-light"
              style={{ marginLeft: 'auto' }}
            >
              <ReactMomentCountDown
                toDate={moment
                  .utc(appointmentStartTime)
                  .tz('America/Los_Angeles')}
              />
            </span>}
        </div>
        <div className="card-body">
          <div className="list-details">
            <div className="list-details list-details--detail">
              <strong className="title">Start Time:</strong>
              <span>
                {slotTime}
              </span>
            </div>
            <div className="list-details list-details--detail">
              <strong className="title">Appointment Type:</strong>
              <span>
                {appointmentType}
              </span>
            </div>
            <div className="list-details list-details--detail">
              <strong className="title">Store Address:</strong>
              <span>
                {`${store.address.street}, ${store.address.city}, ${store
                  .address.country}, ${store.address.postalCode}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
