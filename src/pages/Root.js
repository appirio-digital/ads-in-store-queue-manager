import React from 'react';
import Notifications, { notify } from 'react-notify-toast';

import Header from '../components/Header';
import BookingForm from '../components/BookingForm';
import WaitingTime from '../components/WaitingTime';
import { REACT_APP_API_URL } from './../constants';

export default class Root extends React.Component {
  state = {
    isLoading: false,
    storeDetail: {},
    waitingTime: 0
  };

  async componentDidMount() {
    await this.checkStoreWaitingTime();
  }

  checkStoreWaitingTime = async () => {
    const { store } = this.props.match.params;
    const response = await this.fetchStoreWaiting(store);
    if (response && response.storeDetail) {
      const { storeDetail, waitingTime } = response;
      this.setState({
        isLoading: false,
        storeDetail,
        waitingTime
      });
    } else {
      notify.show(response.message, 'error');
      this.setState({
        isLoading: false
      });
    }
  };

  onFormSubmitSuccess = async paylod => {
    paylod = Object.assign(paylod, { store: this.state.storeDetail.storeId });
    const response = await this.fetchBookAppointment(paylod);
    if (response && response.message) {
      await this.checkStoreWaitingTime();
      this.setState({
        isLoading: false
      });
      notify.show(
        <span>
          <i className="material-icons">done_outline</i> You have been add to
          the queue.
        </span>,
        'info'
      );
    } else {
      notify.show(
        <span>
          <i className="material-icons large">error</i>Sorry we are not able to
          process your request. Please try again later.
        </span>,
        'error'
      );
      this.setState({
        isLoading: false
      });
    }
  };

  onFormSubmitFail = errorMsg => {
    notify.show(errorMsg, 'error');
  };

  fetchStoreWaiting = async store => {
    this.setState({
      isLoading: true
    });
    const url = `${REACT_APP_API_URL.URL}/api/store/storeWaitingTime?store=${store}`;
    const result = await fetch(url);
    return result.ok ? await result.json() : null;
  };

  fetchBookAppointment = async paylod => {
    this.setState({
      isLoading: true
    });
    const url = `${REACT_APP_API_URL.URL}/api/appointment/book`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paylod)
    };
    const result = await fetch(url, options);
    return result.ok ? await result.json() : null;
  };

  render() {
    const { isLoading, waitingTime, storeDetail } = this.state;

    return (
      <div>
        {isLoading &&
          <div className="loader">
            <img
              id="myImg"
              src={require('../common/assets/oval.svg')}
              alt="loading"
            />
          </div>}
        <Header storeDetail={storeDetail} />
        <Notifications
          options={{
            colors: {
              error: {
                color: '#FFFFFF',
                backgroundColor: '#ed0b22'
              },
              info: {
                color: '#FFFFFF',
                backgroundColor: '#4990E2'
              }
            }
          }}
        />
        <div className="container">
          <div className="main-container">
            <WaitingTime waitingTime={waitingTime} />

            <BookingForm
              onFormSubmitSuccess={this.onFormSubmitSuccess}
              onFormSubmitFail={this.onFormSubmitFail}
            />
          </div>
        </div>
      </div>
    );
  }
}
