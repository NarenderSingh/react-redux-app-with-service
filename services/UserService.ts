import { connect } from 'react-redux';
import { configureStore } from '../redux/store/store';

export class UserService {
  private store: any;
  private user: any;
  constructor(user: any) {
    //this.store = configureStore();
    this.user = user;
  }

  getCurrentUser() {
    //const user = store.getState().user;
    return this.user.CurrentUser;
  }
}