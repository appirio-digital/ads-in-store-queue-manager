import React from 'react';
import ReactDOM from 'react-dom';
import SearchListRow from './SearchListRow';
import { shallow } from 'enzyme';

it('should render appointment', () => {
  let onBookActionCalled = false;
  const props = {
    storeItem: {
      isBookedSlot: false,
      slotTime: '09:00',
      store: {
        name: 'S-001',
        address: {
          street: '',
          country: '',
          city: '',
          postalCode: ''
        }
      },
      appointmentType: 'New Service',
      appointmentStartTime: null
    },
    onBookAction: () => {
      onBookActionCalled = true;
    }
  };
  const wrapper = shallow(<SearchListRow {...props} />);
  let button = wrapper.find('button');
  button.simulate('click');

  expect(onBookActionCalled).toBeTruthy();
});
