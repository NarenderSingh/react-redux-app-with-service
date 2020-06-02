import React from 'react';
import { connect } from 'react-redux';
import { updateCurrentUser } from '../../redux/actions/action';
import { UserService } from '../../services/UserService';

const UserComponent = (props: any) => {
  const { user, currentUser, updateDispatch } = props;
  const userService = new UserService(user);

  const updateUser = () => {
    updateDispatch('Jayant');
  }

  const content = (
    <div>     
      User Component
      {
        JSON.stringify(user)
      }
      <hr/>
      {
        currentUser
      }
      <hr/>
      <p>From User Service</p>
      {
        userService.getCurrentUser()
      }
      <hr/>
      <button type="button" onClick={updateUser}>Update User</button>
    </div>
  )

  return content;
}

const mapStateToProps = (state) => ({
  user : state.user,
  currentUser : state.user.CurrentUser
})

const mapDispachToProps = (dispatch) => ({
  updateDispatch : (newUser) => dispatch(updateCurrentUser(newUser))
})

export default connect(mapStateToProps, mapDispachToProps)(UserComponent);

