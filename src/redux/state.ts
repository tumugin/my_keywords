import Category from '../data/category'

export default class State {
  categories: Category[] = []
  keywordsCount: number = 0

  clone(): State {
    return Object.assign({}, this)
  }
}
