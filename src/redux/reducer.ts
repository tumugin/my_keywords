import {ActionType, getType} from 'typesafe-actions'
import * as actions from './action'
import State from './state'
import firebase from '../firebase/config'
import Category from '../data/category';

export type Action = ActionType<typeof actions>

export default function reducer(state: State = new State(), action: Action) {
  switch (action.type) {
    case getType(actions.updateCategoryState):
      const categoryList: Category[] = []
      action.payload.docs.forEach(item => {
        const category = item.data() as Category
        console.log(category)
        categoryList.push(category)
      })
      const statec = state.clone()
      statec.categories = categoryList
      return statec
    case getType(actions.addCategoryToFirestore):
      const document = firebase.firestore().doc(`/users/${firebase.auth().currentUser!.uid}/`)
      return state
    default:
      return state
  }
}
