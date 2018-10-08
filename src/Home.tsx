import * as React from 'react'
import { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import firebase from './firebase/config'
import LocalStorageUtil from './util/LocalStorageUtil';
import { connect } from 'react-redux';
import { subscribeDatabaseEvents } from './firebase/database';
import State from './redux/state';
import { Dispatch } from 'redux';

interface IHome{
  state: State
}

interface IHomeDispatch{
  dispatch: Dispatch
}

export class Home extends Component<RouteComponentProps & IHome & IHomeDispatch>{
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.history.push("/login")
      } else {
        subscribeDatabaseEvents(this.props.dispatch)
      }
    })
  }

  render() {
    return (
      <div>
        <ul>
          {
            this.props.state.categories.map(item => <li>{item.name}</li>)
          }
        </ul>
      </div>
    )
  }
}
function mapStateToProps(state: State):IHome {
  return {state: state}
}

export default withRouter(connect(mapStateToProps)(Home))
