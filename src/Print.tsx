import {Component} from 'react'
import State from './redux/state'
import {RouteComponentProps, withRouter} from 'react-router'
import {connect} from 'react-redux'
import * as React from 'react'
// @ts-ignore
import style from './style/print.scss'

interface IPrintProps {
  state: State
}

class Print extends Component<IPrintProps & RouteComponentProps> {
  render() {
    return (
      <div className="container-fluid">
        <div className={style.categoryParent}>
          {this.props.state.categories.map(item => (
            <div key={item.documentId} className={`card ${style.categoryCard}`}>
              <div className="card-body">
                <h5 className="card-title"><strong>#{item.name}</strong></h5>
                {item.keywords.map(keyword => (
                  <span className={`badge badge-pill badge-primary ${style.keyword}`}
                        key={keyword.id}>{keyword.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: State): IPrintProps {
  return {state}
}

export default withRouter(connect(mapStateToProps)(Print))
