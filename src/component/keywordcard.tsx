import * as React from 'react'
import {ChangeEvent, Component} from "react"
import {connect} from "react-redux"
import {Dispatch} from "redux"
import Category, {Keyword} from "../data/category"
import * as Modal from "react-modal"
import * as database from "../firebase/database"
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import DraggableKeyword from "./draggablekeyword";

interface IKeywordCardDispatch {
  dispatch?: Dispatch
  category: Category
}

class KeywordCardState {
  isDeleteModalOpened: boolean = true
  addKeywordText: string = ""
}

Modal.setAppElement('#root')

@DragDropContext(HTML5Backend)
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
            {this.props.category.keywords.map((keyword, idx) => <DraggableKeyword text={keyword.name!} index={idx}
                                                                                  identifierId={this.props.category.documentId!}
                                                                                  moveCard={this.moveCard}/>)}
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

  private moveCard = async (dragIndex: number, hoverIndex: number) => {
    // swap dragIndex to hoverIndex
    const oldpos = this.props.category.keywords[dragIndex].clone()
    const newpos = this.props.category.keywords[hoverIndex].clone()
    const categorycopy = this.props.category.clone()
    categorycopy.keywords[dragIndex] = newpos
    categorycopy.keywords[hoverIndex] = oldpos
    database.updateCategory(categorycopy)
  }
}

export default connect()(KeywordCard)
