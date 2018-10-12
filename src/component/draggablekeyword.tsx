import * as React from 'react'
import {findDOMNode} from 'react-dom'
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
import {XYCoord} from 'dnd-core'

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
  text: string
  index: number
  isDragging?: boolean
  identifierId: string
  connectDragSource?: ConnectDragSource
  connectDropTarget?: ConnectDropTarget
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

const CardIdentifier: string = "CARD"

@DropTarget(CardIdentifier, cardTarget, (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(CardIdentifier, cardSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
export default class DraggableKeyword extends React.Component<ICardProps> {
  public render() {
    const {
      text,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(<li className="list-group-item" style={{opacity: this.props.isDragging ? 0 : 1}}>{text}</li>)
      )
    )
  }
}
