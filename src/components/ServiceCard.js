import React from 'react';

export default class ServiceCard extends React.Component {
  state = {
    comment: ''
  };

  onInputValueChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  onSubmit = ({ appointment }) => async () => {
    const { onFormSubmitSuccess } = this.props;
    const paylod = {
      comment: this.state.comment,
      appointment
    };
    await onFormSubmitSuccess(paylod);
    this.setState({
      comment: ''
    });
  };

  render() {
    const { currentThree, onAttendCustomerAction } = this.props;
    return (
      <div>
        {currentThree.length >= 3 &&
          <div className="card list-card">
            <div className="card-body">
              <div className="d-flex">
                <h6 className="m-0">
                  <span>
                    {currentThree[2].appointmentName}
                  </span>
                </h6>
                <h6 className="mb-0 ml-a">
                  {currentThree[2].appointmentType}
                </h6>
              </div>
            </div>
          </div>}
        {currentThree.length >= 2 &&
          <div className="card list-card">
            <div className="card-body">
              <div className="d-flex">
                <h6 className="m-0">
                  <span>
                    {currentThree[1].appointmentName}
                  </span>
                </h6>
                <h6 className="mb-0 ml-a">
                  {currentThree[1].appointmentType}
                </h6>
              </div>
            </div>
          </div>}

        {currentThree.length >= 1 &&
          <div className="card list-card active">
            <div className="card-body">
              <div className="card-head text-center">
                <h2>
                  {currentThree[0].appointmentName}
                </h2>

                <h5>
                  {currentThree[0].appointmentType}
                </h5>

                {currentThree[0].appointmentStatus === 'In-Progress' &&
                  <div>
                    <div className="form-group">
                      <textarea
                        name="comment"
                        rows="3"
                        className="form-control"
                        placeholder="Your Comment Here"
                        value={this.state.comment}
                        onChange={e => this.onInputValueChange(e)}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={this.onSubmit({
                        appointment: currentThree[0].appointmentId
                      })}
                    >
                      Complete
                    </button>
                  </div>}
                {currentThree[0].appointmentStatus === 'Waiting' &&
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={onAttendCustomerAction({
                        appointment: currentThree[0].appointmentId
                      })}
                    >
                      Attend Customer
                    </button>
                  </div>}
              </div>
            </div>
          </div>}
      </div>
    );
  }
}
