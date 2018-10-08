import Category from "../data/category"

export default class State {
  hogehoge = 417
  categories: Array<Category> = []

  clone():State {
    return Object.assign({}, this)
  }
}
