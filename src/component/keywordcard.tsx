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

  render() {
    return (
      <div>
        <div className="card border-dark mb-3" style={{width: '18rem'}}>
          <div className="card-header">{this.props.category.name}</div>
          <ul className="list-group list-group-flush">
            {this.props.category.keywords.map((kwd, idx) => <DraggableKeyword keyword={kwd} index={idx}
                                                                              identifierId={this.props.category.documentId!}
                                                                              moveCard={this.moveCard}
                                                                              key={kwd.id}
                                                                              onDeleteClick={this.deleteKeyword}
                                                                              onEdit={this.editKeyword}/>)}
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

  private onAddKeywordChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    await this.setState({addKeywordText: event.target.value})
  }

  private onAddKeyword = async () => {
    if (this.state.addKeywordText === '') {
      return
    }
    const categorycopy = this.props.category.clone()
    categorycopy.keywords.push(new Keyword(this.state.addKeywordText))
    database.updateCategory(categorycopy)
    await this.setState({addKeywordText: ''})
  }

  private moveCard = async (dragIndex: number, hoverIndex: number) => {
    const olditemclone = this.props.category.keywords[dragIndex].clone()
    const oldref = this.props.category.keywords[dragIndex]
    const categorycopy = this.props.category.clone()
    categorycopy.keywords.splice(hoverIndex + (hoverIndex > dragIndex ? 1 : 0), 0, olditemclone)
    categorycopy.keywords.splice(categorycopy.keywords.indexOf(oldref), 1)
    database.updateCategory(categorycopy)
  }

  private deleteKeyword = async (identifierId: string) => {
    const categorycopy = this.props.category.clone()
    const deleteidx = categorycopy.keywords.indexOf(categorycopy.keywords.filter(item => item.id === identifierId)[0])
    categorycopy.keywords.splice(deleteidx, 1)
    database.updateCategory(categorycopy)
  }

  private editKeyword = async (id: string, text: string) => {
    const categorycopy = this.props.category.clone()
    categorycopy.keywords.filter(item => item.id === id)[0].name = text
    database.updateCategory(categorycopy)
  }
}

export default connect()(KeywordCard)
