import * as React from 'react'
import { findDOMNode } from 'react-dom'
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor
} from 'react-dnd'
import { XYCoord } from 'dnd-core'
import * as octicons from 'octicons'
// @ts-ignore
import ReactHtmlParser from 'react-html-parser'
import { Keyword } from '../data/category'
import { ChangeEvent } from 'react'

const cardSource = {
  beginDrag(props: ICardProps) {
    return {
      index: props.index,
      identifierId: props.identifierId
    }
  }
}

const cardTarget = {
  hover(props: ICardProps, monitor: DropTargetMonitor, component: DraggableKeyword | null) {
    if (!component) {
      return null
    }
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    if (dragIndex === hoverIndex) {
      return
    }
    if ((monitor.getItem() as ICardProps).identifierId !== props.identifierId) {
      return
    }

    const hoverBoundingRect = (findDOMNode(component) as Element).getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }
    props.moveCard(dragIndex, hoverIndex)
    monitor.getItem().index = hoverIndex
    return
  }
}

export interface ICardProps {
  keyword: Keyword
  index: number
  isDragging?: boolean
  identifierId: string
  connectDragSource?: ConnectDragSource
  connectDropTarget?: ConnectDropTarget
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onDeleteClick: (id: string) => void
  onEdit: (id: string, changedText: string) => void
}

class CardState {
  editedText: string = ''
  textboxShown: boolean = false
}

const CardIdentifier = 'CARD'

// TODO: !!!!WORKAROUND FOR DECORATOR ERRORS!!!!
// @ts-ignore
@DropTarget(CardIdentifier, cardTarget, (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget()
}))
// @ts-ignore
@DragSource(CardIdentifier, cardSource, (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class DraggableKeyword extends React.Component<ICardProps, CardState> {
  constructor(props: ICardProps) {
    super(props)
    this.state = new CardState()
  }

  public render() {
    const { isDragging, onDeleteClick, identifierId, connectDragSource, connectDropTarget } = this.props
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <li
            className="list-group-item"
            style={{
              opacity: isDragging ? 0 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: this.state.textboxShown ? 'none' : 'inline' }}>{this.props.keyword.name}</span>
            <form
              onSubmit={this.onEditKeyword}
              action="javascript:void(0)"
              style={{ display: this.state.textboxShown ? 'inline' : 'none', width: '100%' }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="単語を新しく追加"
                value={this.state.editedText}
                onChange={this.onEditKeywordChanged}
              />
            </form>
            <span style={{ display: this.state.textboxShown ? 'none' : 'inline', whiteSpace: 'nowrap' }}>
              <a onClick={this.onEditKeywordClick} href="#" style={{ marginRight: '10px' }}>
                {ReactHtmlParser(octicons.pencil.toSVG())}
              </a>
              <a onClick={() => onDeleteClick(this.props.keyword.id!)} href="#">
                {ReactHtmlParser(octicons.trashcan.toSVG())}
              </a>
            </span>
          </li>
        )
      )
    )
  }

  private onEditKeywordClick = async () => {
    await this.setState({ editedText: this.props.keyword.name! })
    await this.setState({ textboxShown: true })
  }

  private onEditKeywordChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    await this.setState({ editedText: event.target.value })
  }

  private onEditKeyword = async () => {
    if (this.state.editedText === '') {
      return
    }
    await this.setState({ textboxShown: false })
    this.props.onEdit(this.props.keyword.id!, this.state.editedText)
  }
}
