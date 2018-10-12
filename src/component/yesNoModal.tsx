import * as React from 'react'
import {Component} from "react"

interface IYesNoModal {
  modalTitle: string
  messageText: string
  yesText: string
  noText: string
  onDialogClosed: (isAccepted: boolean) => void
}

export default class YesNoModal extends Component<IYesNoModal> {
  render() {
    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{this.props.modalTitle}</h5>
          </div>
          <div className="modal-body">
            <p>{this.props.messageText}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary"
                    onClick={() => this.props.onDialogClosed(true)}>{this.props.yesText}</button>
            <button type="button" className="btn btn-secondary"
                    onClick={() => this.props.onDialogClosed(false)}>{this.props.noText}</button>
          </div>
        </div>
      </div>
    )
  }
}
