import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { logger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import { userReducer } from '../reducers/reducer';
import { volumeReducer } from '../reducers/volumeReducer';

const rootEpic = combineEpics();
const reducers = {
  user : userReducer,
  volume : volumeReducer
};
const rootReducer = combineReducers(reducers);
const epicMiddleware = createEpicMiddleware();

export function configureStore(): any {
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);
  return store;
}