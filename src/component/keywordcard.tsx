import * as React from 'react'
import {ChangeEvent, Component} from "react"
import {connect} from "react-redux"
import {Dispatch} from "redux"
import Category, {Keyword} from "../data/category"
import * as Modal from "react-modal"
import * as database from "../firebase/database"

interface IKeywordCardDispatch {
  dispatch?: Dispatch
  category: Category
}

class KeywordCardState {
  isDeleteModalOpened: boolean = true
  addKeywordText: string = ""
}

Modal.setAppElement('#root')

class KeywordCard extends Component<IKeywordCardDispatch, KeywordCardState> {
  constructor(props: IKeywordCardDispatch) {
    super(props)
    this.state = new KeywordCardState()
  }

  onAddKeywordChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    await this.setState({addKeywordText: event.target.value})
  }

  onAddKeyword = async () => {
    if (this.state.addKeywordText === '') {
      return
    }
    const categorycopy = this.props.category.clone()
    categorycopy.keywords.push(new Keyword(this.state.addKeywordText))
    database.updateCategory(categorycopy)
    await this.setState({addKeywordText: ''})
  }

  render() {
    return (
      <div>
        <div className="card border-dark mb-3" style={{width: '18rem'}}>
          <div className="card-header">{this.props.category.name}</div>
          <ul className="list-group list-group-flush">
            {this.props.category.keywords.map(keyword => <li className="list-group-item">{keyword.name}</li>)}
            <li className="list-group-item">
              <form onSubmit={this.onAddKeyword} action="javascript:void(0)">
                <input type="text" className="form-control" placeholder="単語を新しく追加" value={this.state.addKeywordText}
                       onChange={this.onAddKeywordChanged}/>
              </form>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default connect()(KeywordCard)
