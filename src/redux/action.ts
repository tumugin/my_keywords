import {action, createStandardAction, createAction} from 'typesafe-actions';
import Category from '../data/category';

export const updateCategoryState = createAction('UPDATE_CATEGORY_STATE_FIRBASE', resolve => {
  return (snapshot: firebase.firestore.QuerySnapshot) => resolve(snapshot)
})

export const addCategoryToFirestore = createAction('ADD_CATEGORY_TO_FIRESTORE', resolve => {
  return (category: Category) => resolve(category)
})
