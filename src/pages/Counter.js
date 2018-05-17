import React from 'react';
import Notifications, { notify } from 'react-notify-toast';

import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import { REACT_APP_API_URL } from './../constants';

export default class Counter extends React.Component {
  state = {
    isLoading: false,
    storeDetail: {},
    queue: [],
    representative: {}
  };

  async componentDidMount() {
    await this.getRepresentativeQueue();
  }

  getRepresentativeQueue = async () => {
    const { store, representative } = this.props.match.params;
    const response = await this.fetchStoreQueue({ store, representative });
    if (response && response.storeDetail) {
      const { storeDetail, counters } = response;
      const { queue, representative } = counters;

      if (queue.length == 0) {
        notify.show('Your queue is empty.', 'info');
      }
      this.setState({
        isLoading: false,
        storeDetail,
        representative,
        queue
      });
    } else {
      notify.show(
        'Sorry we are not able to process your request. Please try again.',
        'error'
      );
      this.setState({
        isLoading: false
      });
    }
  };

  fetchStoreQueue = async ({ store, representative }) => {
    this.setState({
      isLoading: true
    });
    const url = `${REACT_APP_API_URL.URL}/api/store/storeWaitingQueue?store=${store}&representative=${representative}`;
    const result = await fetch(url);
    return result.ok ? await result.json() : null;
  };

  onAttendCustomerAction = ({ appointment }) => async () => {
    const paylod = {
      appointment,
      representative: this.state.representative.id
    };
    const response = await this.fetchAttendCustomer(paylod);
    if (response && response.message) {
      const queue = [...this.state.queue].map(
        q =>
          q.appointmentId === appointment
            ? Object.assign(q, { appointmentStatus: 'In-Progress' })
            : q
      );
      this.setState({
        isLoading: false,
        queue
      });
    } else {
      notify.show(
        'Sorry we are not able to process your request. Please try again later.',
        'error'
      );
      this.setState({
        isLoading: false
      });
    }
  };

  onFormSubmitSuccess = async paylod => {
    const response = await this.closeAppointment(paylod);
    if (response && response.message) {
      await this.getRepresentativeQueue();
      this.setState({
        isLoading: false
      });
    } else {
      notify.show(
        'Sorry we are not able to process your request. Please try again later.',
        'error'
      );
      this.setState({
        isLoading: false
      });
    }
  };

  closeAppointment = async paylod => {
    this.setState({
      isLoading: true
    });
    const url = `${REACT_APP_API_URL.URL}/api/representative/closeCustomerRequest`;
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

  fetchAttendCustomer = async paylod => {
    this.setState({
      isLoading: true
    });
    const url = `${REACT_APP_API_URL.URL}/api/representative/attendCustomer`;
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
    const { isLoading, storeDetail, queue, representative } = this.state;

    const currentThree = queue.slice(0, 3);
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
            {representative.name &&
              <h2 className="representative">
                Hi, {representative.name}
              </h2>}
            <ServiceCard
              currentThree={currentThree}
              onAttendCustomerAction={this.onAttendCustomerAction}
              onFormSubmitSuccess={this.onFormSubmitSuccess}
            />
          </div>
        </div>
      </div>
    );
  }
}
