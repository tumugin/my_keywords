export class Keyword {
  name?: string
  order = 0
}

export default class Category {
  name?: string
  color = "#00000"
  order = 0
  keywords: Keyword[] = []
  documentId?: string

  clone() {
    return Object.assign({}, this)
  }

  firebaseObject() {
    const cloneobj = Object.assign({}, this)
    delete cloneobj.documentId
    return cloneobj
  }
}
