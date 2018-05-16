import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import './common/assets/main.css';

// Redux
import configureStore, { history } from './redux/store';

// Higher Order Components
//import { connectAsAuthenticated } from './redux/connectors';

// Routes
import Root from './pages/Root';
import Counter from './pages/Counter';
import NotFound from './pages/NotFound';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <Route exact path="/:store" component={Root} />
          <Route exact path="/counter/:store/:representative" component={Counter} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
