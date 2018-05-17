import React from 'react';
import ServiceCard from './ServiceCard';
import { shallow } from 'enzyme';

it('should render appointment', () => {
  let onAttendCustomerCalled = false;
  const props = {
    currentThree: [
      {
        appointmentId: 'a00f4000008qcrmAAA',
        appointmentName: 'sandeep Ri',
        appointmentStartTime: null,
        appointmentStatus: 'Waiting',
        appointmentType: 'New Service',
        representativeId: null
      },
      {
        appointmentId: 'a00f4000008qcrmAZZ',
        appointmentName: 'sandeep 001',
        appointmentStartTime: null,
        appointmentStatus: 'Waiting',
        appointmentType: 'New Service',
        representativeId: null
      },
      {
        appointmentId: 'a00f4000008qcrmYYY',
        appointmentName: 'sandeep 002',
        appointmentStartTime: null,
        appointmentStatus: 'Waiting',
        appointmentType: 'New Service',
        representativeId: null
      }
    ],
    onAttendCustomerAction: () => {
      onAttendCustomerCalled = true;
    }
  };
  const wrapper = shallow(<ServiceCard {...props} />);
  let button = wrapper.find('button');
  button.simulate('click');

  expect(onAttendCustomerCalled).toBeTruthy();
});
