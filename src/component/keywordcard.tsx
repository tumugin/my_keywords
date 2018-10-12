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
import * as octicons from 'octicons'
// @ts-ignore
import ReactHtmlParser from 'react-html-parser'
import YesNoModal from "./yesNoModal";

interface IKeywordCardDispatch {
  dispatch?: Dispatch
  category: Category
}

class KeywordCardState {
  isDeleteModalOpened: boolean = false
  addKeywordText: string = ""
  categoryNameEditText: string = ""
  categoryNameEditOpened: boolean = false
}

Modal.setAppElement('#root')

@DragDropContext(HTML5Backend)
class KeywordCard extends Component<IKeywordCardDispatch, KeywordCardState> {
  private ModalStyle: Modal.Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      width: '400px'
    }
  }

  constructor(props: IKeywordCardDispatch) {
    super(props)
    this.state = new KeywordCardState()
  }

  render() {
    return (
      <div>
        <div className="card border-dark mb-3" style={{width: '18rem'}}>
          <div className="card-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span
              style={{display: this.state.categoryNameEditOpened ? 'none' : 'inline'}}>{this.props.category.name}</span>
            <form action="javascript:void(0)" onSubmit={this.onCategoryNameChanged}
                  style={{display: this.state.categoryNameEditOpened ? 'inline' : 'none'}}>
              <input type="text" className="form-control" placeholder="カテゴリーの名前"
                     value={this.state.categoryNameEditText} onChange={this.onCategoryNameEditTextChanged}/>
            </form>
            <span style={{display: this.state.categoryNameEditOpened ? 'none' : 'inline', whiteSpace: 'nowrap'}}>
              <a href="#" onClick={this.onCategoryNameEditClicked}
                 style={{paddingRight: '10px'}}>{ReactHtmlParser(octicons.pencil.toSVG())}</a>
              <a href="#" onClick={this.onCategoryDeleteClicked}>{ReactHtmlParser(octicons.trashcan.toSVG())}</a>
            </span>
          </div>
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
        <Modal isOpen={this.state.isDeleteModalOpened} style={this.ModalStyle}>
          <YesNoModal messageText="本当にカテゴリを削除しますか?" modalTitle="確認" noText="やめる" yesText="削除する"
                      onDialogClosed={this.onCategoryDelete}/>
        </Modal>
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
    await database.updateCategory(categorycopy)
  }

  private editKeyword = async (id: string, text: string) => {
    const categorycopy = this.props.category.clone()
    categorycopy.keywords.filter(item => item.id === id)[0].name = text
    await database.updateCategory(categorycopy)
  }

  private onCategoryNameEditClicked = async () => {
    this.setState({categoryNameEditOpened: true, categoryNameEditText: this.props.category.name!})
  }

  private onCategoryNameEditTextChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    await this.setState({categoryNameEditText: event.target.value})
  }

  private onCategoryNameChanged = async () => {
    if (this.state.categoryNameEditText === '') {
      return
    }
    const categorycopy = this.props.category.clone()
    categorycopy.name = this.state.categoryNameEditText
    await database.updateCategory(categorycopy)
    this.setState({categoryNameEditOpened: false})
  }

  private onCategoryDeleteClicked = async () => {
    this.setState({isDeleteModalOpened: true})
  }

  private onCategoryDelete = async (isAccepted: boolean) => {
    if (isAccepted) {
      database.deleteCategory(this.props.category.documentId!)
    }
    this.setState({isDeleteModalOpened: false})
  }
}

export default connect()(KeywordCard)
