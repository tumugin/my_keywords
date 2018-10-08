import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import Home from './Home'
import Login from './Login'
import reducer from './redux/reducer'
import registerServiceWorker from './registerServiceWorker'

const store = createStore(reducer)
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'))

registerServiceWorker()
