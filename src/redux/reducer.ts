import {ActionType, getType} from 'typesafe-actions'
import * as actions from './action'
import State from './state'
import Category, {Keyword} from '../data/category'

export type Action = ActionType<typeof actions>

export default function reducer(state: State = new State(), action: Action) {
  switch (action.type) {
    case getType(actions.updateCategoryState):
      const categoryList: Category[] = []
      action.payload.docs.forEach(item => {
        const category = Object.assign(new Category(), item.data())
        category.documentId = item.id
        category.keywords = category.keywords.map(keyword => Object.assign(new Keyword(), keyword))
        console.log(category)
        categoryList.push(category)
      })
      const keywordcount = categoryList.map(item => item.keywords.length).reduce((sum, itm) => sum += itm, 0)
      const statec = Object.assign(new State(), state)
      statec.keywordsCount = keywordcount
      statec.categories = categoryList
      return statec
    default:
      return state
  }
}
