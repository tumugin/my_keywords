import firebase from './config'
import * as Redux from 'redux'
import * as AppAction from '../redux/action'
import Category from '../data/category';

export async function subscribeDatabaseEvents(dispatch: Redux.Dispatch) {
  const document = firebase.firestore().doc(`/users/${firebase.auth().currentUser!.uid}/`)
  document.collection('category').onSnapshot(snapshot => {
    dispatch(AppAction.updateCategoryState(snapshot))
  })
}

export async function addCategory(category: Category) {
  const currentUserDocument = firebase.firestore().doc(`/users/${firebase.auth().currentUser!.uid}/`)
  await currentUserDocument.collection('category').add(category.firebaseObject())
}
