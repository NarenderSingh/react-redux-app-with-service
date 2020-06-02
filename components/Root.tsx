import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../redux/store/store';
import UserComponent from './user/UserComponent';
import RequestForm from './volume/RequestForm';

const Root = () => {
  const content = (
    <Provider store={configureStore()}>
      <RequestForm />
    </Provider>
  )

  return content;
}

export default Root;

