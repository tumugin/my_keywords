import * as React from 'react'
import {Component} from 'react'
import {connect} from 'react-redux'
import firebase from './firebase/config'
import {subscribeDatabaseEvents} from './firebase/database'
import {Dispatch} from 'redux'

interface IStartupComponentProp {
  dispatch?: Dispatch
}

class StartupComponent extends Component<IStartupComponentProp> {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        subscribeDatabaseEvents(this.props.dispatch!)
      }
    })
  }

  render() {
    // https://stackoverflow.com/questions/42083181/is-it-possible-to-return-empty-in-react-render-function
    return (null)
  }
}

export default connect()(StartupComponent)
