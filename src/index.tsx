import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import './index.css'
import Home from './Home'
import Login from './Login'
import reducer from './redux/reducer'
// @ts-ignore
import registerServiceWorker from './registerServiceWorker.js'

const store = createStore(reducer)
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact={true} path='/' component={Home}/>
        <Route exact={true} path='/login' component={Login}/>
      </Switch>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'))

registerServiceWorker()
