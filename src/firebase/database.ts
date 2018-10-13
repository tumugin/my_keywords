import firebase from './config'
import * as Redux from 'redux'
import * as AppAction from '../redux/action'
import Category from '../data/category'

function getCurrentUserDocument() {
  return firebase.firestore().doc(`/users/${firebase.auth().currentUser!.uid}/`)
}

let unsubscribe: firebase.Unsubscribe

export async function subscribeDatabaseEvents(dispatch: Redux.Dispatch) {
  const document = getCurrentUserDocument()
  if (unsubscribe) {
    unsubscribe()
  }
  unsubscribe = document.collection('category').onSnapshot(snapshot => {
    dispatch(AppAction.updateCategoryState(snapshot))
  })
}

export async function addCategory(category: Category) {
  const currentUserDocument = getCurrentUserDocument()
  await currentUserDocument.collection('category').add(category.firebaseObject())
}

export async function deleteCategory(documentId: string) {
  const currentUserDocument = getCurrentUserDocument()
  await currentUserDocument.collection('category').doc(documentId).delete()
}

export async function updateCategory(category: Category) {
  const currentUserDocument = getCurrentUserDocument()
  await currentUserDocument.collection('category').doc(category.documentId).update(category.firebaseObject())
}
