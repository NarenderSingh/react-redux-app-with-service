
import { IntialState } from '../states/state';
import { GET_CURRENT_USER, UPDATE_CURRENT_USER } from '../actions/action';

export const userReducer = (state = IntialState, action: any) => {
    const { type, payload } = action;

    switch (type) {
      case GET_CURRENT_USER : {
        return state;
      }
      case UPDATE_CURRENT_USER : {
        const { newUser } = payload;
        
        return {
          ...state,
          CurrentUser: newUser
        };
      }
        default:
            return state;
    }
};
