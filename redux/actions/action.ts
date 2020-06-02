export const GET_CURRENT_USER = 'GET_CURRENT_USER';
export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';

export const getCurrentUser = () => ({
  type: GET_CURRENT_USER
});

export const updateCurrentUser = (newUser: any) => ({
  type: UPDATE_CURRENT_USER,
  payload: { newUser }
});