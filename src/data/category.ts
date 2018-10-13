import * as uuidv4 from 'uuid/v4'

export class Keyword {
  name?: string
  id?: string
  order = 0

  constructor(name?: string) {
    this.name = name
    this.id = uuidv4()
  }

  toPureObject() {
    return Object.assign({}, this)
  }

  clone() {
    return Object.assign(new Keyword(), this) as Keyword
  }
}

export default class Category {
  name?: string
  color = '#00000'
  order = 0
  keywords: Keyword[] = []
  documentId?: string

  clone() {
    return Object.assign(new Category(), this) as Category
  }

  firebaseObject() {
    const cloneobj = Object.assign({}, this)
    delete cloneobj.documentId
    cloneobj.keywords = this.keywords.map(itm => itm.toPureObject())
    return cloneobj
  }
}
