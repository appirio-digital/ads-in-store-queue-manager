import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { LOCAL_STORAGE, REACT_APP_API_URL } from '../../constants';
import * as ProfileActionCreators from '../actions/profile';

export default function connectAsAuthenticated(WrappedComponent) {
  class ConnectedComponent extends React.Component {
    componentDidMount() {
      const { profileActions, push } = this.props;
      if (!localStorage[LOCAL_STORAGE.TOKEN]) {
        push('/');
      }
      if (localStorage[LOCAL_STORAGE.TOKEN]) {
        let auth = JSON.parse(localStorage[LOCAL_STORAGE.TOKEN]);
        this.findProfile(auth.access_token);
        profileActions.retrieveProfileFromToken(auth.access_token);
      }
    }

    findProfile = async access_token => {
      const url = `${REACT_APP_API_URL.URL}/api/user/profile`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      };
      const result = await fetch(url, options);
      const jsonResponse = await result.json();
    };

    /*componentWillReceiveProps(nextProps) {
      const { push } = this.props;
      if (nextProps.profile.access_token !== localStorage[LOCAL_STORAGE.TOKEN]) {
        push('/');
      }
    }*/

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    let { profile } = state;
    return {
      profile
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      push: bindActionCreators(push, dispatch),
      profileActions: bindActionCreators(ProfileActionCreators, dispatch)
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(ConnectedComponent);
}
