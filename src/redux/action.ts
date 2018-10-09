import {action, createStandardAction, createAction} from 'typesafe-actions';

export const updateCategoryState = createAction('UPDATE_CATEGORY_STATE_FIRBASE', resolve => {
  return (snapshot: firebase.firestore.QuerySnapshot) => resolve(snapshot)
})
