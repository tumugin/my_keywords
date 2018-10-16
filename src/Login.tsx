import * as React from 'react'
import {Component} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import firebase from './firebase/config'
import {connect} from 'react-redux'
// @ts-ignore
import style from './style/login.scss'

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
      <div className={style.componentRoot}>
        <div className={style.loginContainer}>
          <h3 style={{paddingBottom: '20px'}}>ログイン</h3>
          <button onClick={this.googleLogin} className="btn btn-danger">Googleでログイン</button>
          <p>{this.state.isLoggedIn ? 'ログイン済みです' : '未ログインです'}</p>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(Login))
