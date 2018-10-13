import Category from '../data/category'

export default class State {
  categories: Category[] = []

  clone(): State {
    return Object.assign({}, this)
  }
}
