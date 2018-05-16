import React from 'react';

export default class BookingForm extends React.Component {
  state = {
    userName: '',
    visitType: ''
  };

  onInputValueChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleValidation = () => {
    const userName = this.state.userName;
    const visitType = this.state.visitType;
    let errorMsg = '';
    if (userName.length === 0) {
      errorMsg = 'Please enter your name';
    } else if (visitType.length === 0) {
      errorMsg = 'Please select visit type';
    }
    return errorMsg;
  };

  onSubmit = async () => {
    const { onFormSubmitSuccess, onFormSubmitFail } = this.props;
    const errorMsg = this.handleValidation();
    if (errorMsg.length === 0) {
      const paylod = {
        serviceType: this.state.visitType,
        name: this.state.userName
      };
      await onFormSubmitSuccess(paylod);
      this.setState({
        userName: '',
        visitType: ''
      });
    } else {
      onFormSubmitFail(errorMsg);
    }
  };

  render() {
    return (
      <div className="enter-info-form">
        <div className="form-row">
          <div className="form-group col-md-6">
            <input
              type="text"
              className="form-control"
              name="userName"
              placeholder="Enter Your Name"
              value={this.state.userName}
              onChange={e => this.onInputValueChange(e)}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputState" className="sr-only">
              State
            </label>
            <select
              className="form-control"
              name="visitType"
              value={this.state.visitType}
              onChange={e => this.onInputValueChange(e)}
            >
              <option default value="">
                Select Visit Type
              </option>
              <option>New Service</option>
              <option>Product Support</option>
              <option>Maintenance/Replacements</option>
              <option>Account Issues</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={this.onSubmit}>
          Book Service Event
        </button>
      </div>
    );
  }
}
