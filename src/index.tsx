import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import './index.css'
import Home from './Home'
import Login from './Login'
import reducer from './redux/reducer'
import 'bootstrap/dist/css/bootstrap.min.css'

// @ts-ignore
import registerServiceWorker from './registerServiceWorker.js'
import StartupComponent from './StartupComponent'
import Print from './Print'

const store = createStore(reducer)
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div id="router-container">
        <StartupComponent/>
        <Switch>
          <Route exact={true} path="/" component={Home}/>
          <Route exact={true} path="/login" component={Login}/>
          <Route exact={true} path="/print" component={Print}/>
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'))

registerServiceWorker()
