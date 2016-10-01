import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutUser }  from '../actions/firebase_actions';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
        imgUrl: '/static/noImage.png',
    };
    this.props.fetchUser();
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.props.logoutUser().then(data => {
      // reload props from reducer
      this.setState({imgUrl: '/static/noImage.png'});
      this.props.fetchUser();
    });
  }

  renderUserMenu(currentUser) {
    // if current user exists and user id exists than make user navigation
    if (currentUser && currentUser.uid) {
      var loginProvider = currentUser.providerData[0].providerId;
      var welcomeName = currentUser.providerData[0].email != undefined ? currentUser.providerData[0].email : currentUser.providerData[0].displayName;

      var imageUrl = getProviderImage(currentUser.providerData[0]);

      this.setState({
          imgUrl: imageUrl,
      });
      return (
        <li className="dropdown">
          
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
            aria-haspopup="true" aria-expanded="false">           
            {welcomeName} 
            <span className="caret"></span>&nbsp;&nbsp;
             <img src={this.state.imgUrl} width='45px'  />
             
            </a>
          <ul className="dropdown-menu">
            <li><Link to="/profile">Profile</Link></li>
            <li role="separator" className="divider"></li>
            <li><Link to="/logout" onClick={this.logOut}>Logout</Link></li>
          </ul>
          
        </li>
        
      )
    }
    else {
      return [
        <li key={1}><Link to="/login">Login</Link></li>,
        <li key={2}><Link to="/register">Register</Link></li>
      ]
    }
  }

  render() {
    return (
      <div>
        <header className="navbar navbar-static-top navbar-inverse" id="top" role="banner">
          <div className="container">
            <div className="navbar-header">
              <button className="navbar-toggle collapsed" type="button" data-toggle="collapse"
                data-target=".bs-navbar-collapse"><span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/" className="navbar-brand">LargerHope.org</Link>

            </div>
            <nav className="collapse navbar-collapse bs-navbar-collapse" role="navigation">
              <ul className="nav navbar-nav">
                <li><Link to="/"> Home</Link></li>
                ,
              </ul>
              <ul className="nav navbar-nav navbar-right">
                { this.renderUserMenu(this.props.currentUser) }
              </ul>
            </nav>
          </div>
        </header>

        <div className="container">
          
          {this.props.children}
        </div>
      </div>
    );
  }
}

function getProviderImage(providerData) {

    switch (providerData.providerId) {
      case "password":
        return '/static/noImage.png';
      case "facebook.com":
        return providerData.photoURL;
      case "github.com":
        return providerData.imageUrl;
      case "google.com":
        return providerData.photoURL;
      case "twitter.com":
        return providerData.photoURL;
      default:
        return '/static/noImage.png';

    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUser, logoutUser }, dispatch);
}


function mapStateToProps(state) {
  return { currentUser: state.currentUser };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
