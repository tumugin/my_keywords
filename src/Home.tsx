import * as React from 'react'
import {Component} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import firebase from './firebase/config'
import {connect} from 'react-redux';
import {subscribeDatabaseEvents} from './firebase/database';
import State from './redux/state';
import {Dispatch} from 'redux';

interface IHome {
  state: State
}

interface IHomeDispatch {
  dispatch: Dispatch
}

class HomeState {
  loginName: string = "(読み込み中...)"
}

export class Home extends Component<RouteComponentProps & IHome & IHomeDispatch, HomeState> {
  onAuthStateChangedUnsubscribe?: firebase.Unsubscribe

  constructor(props: RouteComponentProps & IHome & IHomeDispatch) {
    super(props)
    this.state = new HomeState()
  }

  firebaseLogout = async () => {
    await firebase.auth().signOut()
    this.props.history.push("/login")
  }

  componentWillMount() {
    this.onAuthStateChangedUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.history.push("/login")
      } else {
        subscribeDatabaseEvents(this.props.dispatch)
        this.setState({loginName: firebase.auth().currentUser!.displayName!})
      }
    })
  }

  componentWillUnmount() {
    if (this.onAuthStateChangedUnsubscribe) {
      this.onAuthStateChangedUnsubscribe()
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="#">my_keywords</a>
          <ul className="nav">
            <li className="nav-item"><span className="navbar-text nav-link">ようこそ、{this.state.loginName}さん</span></li>
            <li className="nav-item">
              <button className="btn btn-outline-danger my-2 my-sm-0" onClick={this.firebaseLogout}>ログアウト</button>
            </li>
          </ul>
        </nav>
        <ul>
          {this.props.state.categories.map(item => <li>{item.name}</li>)}
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state: State): IHome {
  return {state}
}

export default withRouter(connect(mapStateToProps)(Home))
