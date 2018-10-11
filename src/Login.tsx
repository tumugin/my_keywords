import * as React from 'react'
import {Component} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import firebase from './firebase/config'
import {connect} from "react-redux";

class LoginState {
  isLoggedIn: boolean = false
}

class Login extends Component<RouteComponentProps, LoginState> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = new LoginState()
  }

  googleLogin = async () => {
    try {
      await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      this.props.history.push('/')
    } catch (ex) {
      console.log('login fail.')
      console.log(ex.toString())
    }
  }

  async componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({isLoggedIn: true})
      }
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.googleLogin}>Googleでログイン</button>
        <p>{this.state.isLoggedIn ? "ログイン済み" : "未ログイン"}</p>
      </div>
    )
  }
}

export default withRouter(connect()(Login))
