import * as React from 'react'
import {Component} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import firebase from './firebase/config'
import LocalStorageUtil from './util/LocalStorageUtil';

class LoginState {
  isLoggedIn: boolean = false
}

export class Login extends Component<RouteComponentProps, LoginState> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = new LoginState()
  }

  async googleLogin() {
    try {
      localStorage.setItem(LocalStorageUtil.firebaseAuthKey, "true")
      await firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    } catch {
      localStorage.removeItem(LocalStorageUtil.firebaseAuthKey)
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({isLoggedIn: true})
        localStorage.setItem(LocalStorageUtil.firebaseAuthUID, user.uid)
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

export default withRouter(Login)
