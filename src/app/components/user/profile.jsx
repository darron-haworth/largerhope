import React, {Component} from 'react';
import firebase from '../../utils/firebase';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, updateUser}  from '../../actions/firebase_actions';
import Loading  from '../helpers/loading';
import ChangePassword from './change_password';

class UserProfile extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: ''
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    var email = this.refs.email.value;
    var displayName = this.refs.displayName.value;
    this.props.updateUser({email: email, displayName: displayName}).then(data => {

        if (data.payload.errorCode)
          this.setState({message: data.payload.errorMessage})
        else
          this.setState({
            message: "Updated successfuly!"
          })

      }
    )
  }

  render() {
    //var myImage = require("../../static/noImage.png");
    if (!this.props.currentUser) {
      return <Loading/>
    }

    return (
      <div className="col-md-6">
        <form id="frmProfile" role="form" onSubmit={this.onFormSubmit}>
          <h2>User Profile Page</h2>
          <p>{this.state.message}</p>
          <br />
          <div className="form-group">
            <label htmlFor="email">Email: </label>
            <input type="text" defaultValue={this.props.currentUser.email}
                   className="form-control" id="email" ref="email" placeholder="Email" name="email"/>
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Display name: </label>
            <input type="text" defaultValue={this.props.currentUser.displayName}
                   className="form-control" ref="displayName" id="displayName" placeholder="Display name"
                   name="displayName"/>
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
          <ChangePassword ProviderId={this.props.currentUser.providerData[0].providerId} />        
      </div>
    )
  }

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, updateUser}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
