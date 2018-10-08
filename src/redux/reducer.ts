import { ActionType, getType } from 'typesafe-actions'
import * as actions from './action'
import State from './state'
import firebase from '../firebase/config'
import Category from '../data/category';
export type Action = ActionType<typeof actions>

export default function reducer(state: State = new State(), action: Action) {
  switch (action.type) {
    case getType(actions.updateCategoryState):
      let categoryList: Array<Category> = []
      action.payload.docs.forEach(item => {
        let category = item.data() as Category
        console.log(category)
        categoryList.push(category)
      })
      let statec = state.clone()
      statec.categories = categoryList
      return statec
    default:
      return state
  }
}
