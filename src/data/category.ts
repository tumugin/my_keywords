export class Keyword {
  name?: string
  order = 0

  constructor(name?: string) {
    this.name = name
  }

  toPureObject() {
    return Object.assign({}, this)
  }
}

export default class Category {
  name?: string
  color = "#00000"
  order = 0
  keywords: Keyword[] = []
  documentId?: string

  clone() {
    return Object.assign(new Category(), this)
  }

  firebaseObject() {
    const cloneobj = Object.assign({}, this)
    delete cloneobj.documentId
    cloneobj.keywords = this.keywords.map(itm => itm.toPureObject())
    return cloneobj
  }
}
