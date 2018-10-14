import * as React from 'react'
import {Component} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import firebase from './firebase/config'
import {connect} from 'react-redux'
import State from './redux/state'
import {Dispatch} from 'redux'
import KeywordCard from './component/keywordcard'
import {ChangeEvent} from 'react'
import * as database from './firebase/database'
import Category from './data/category'
import Masonry from 'react-masonry-component'

interface IHome {
  state: State
}

interface IHomeDispatch {
  dispatch: Dispatch
}

class HomeState {
  loginName: string = '(読み込み中...)'
  newCategoryNameText: string = ''
}

class Home extends Component<RouteComponentProps & IHome & IHomeDispatch, HomeState> {
  onAuthStateChangedUnsubscribe?: firebase.Unsubscribe

  constructor(props: RouteComponentProps & IHome & IHomeDispatch) {
    super(props)
    this.state = new HomeState()
  }

  firebaseLogout = async () => {
    await firebase.auth().signOut()
    this.props.history.push('/login')
  }

  componentWillMount() {
    this.onAuthStateChangedUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.history.push('/login')
      } else {
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
        <div className="container-fluid" style={{paddingTop: '20px'}}>
          <form action="javascript:void(0)" className="d-flex flex-row align-items-center flex-wrap"
                onSubmit={this.onCategoryAdd}>
            <input type="text" className="form-control" placeholder="追加するカテゴリーの名前を入力"
                   style={{width: '300px', marginRight: '10px'}}
                   value={this.state.newCategoryNameText} onChange={this.onNewCategoryTextChanged}/>
            <button type="submit" className="btn btn-outline-success" style={{marginRight: '10px'}}>カテゴリを追加</button>
            <button type="button" onClick={this.onPrintClick} className="btn btn-outline-primary" style={{marginRight: '10px'}}>印刷用HTML表示</button>
            <span>合計キーワード数: {this.props.state.keywordsCount}個</span>
          </form>
          <Masonry style={{paddingTop: '20px'}}>
            {this.props.state.categories.map(item => <div style={{margin: '10px'}} key={item.documentId}>
              <KeywordCard category={item}/>
            </div>)}
          </Masonry>
        </div>
      </div>
    )
  }

  private onNewCategoryTextChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({newCategoryNameText: event.target.value})
  }

  private onCategoryAdd = async () => {
    const category = new Category()
    category.name = this.state.newCategoryNameText
    await database.addCategory(category)
    this.setState({newCategoryNameText: ''})
  }

  private onPrintClick = () => {
    this.props.history.push('/print')
  }
}

function mapStateToProps(state: State): IHome {
  return {state}
}

export default withRouter(connect(mapStateToProps)(Home))
