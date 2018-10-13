import * as firebase from 'firebase'
const config = {
  apiKey: 'AIzaSyCqO-s38IXW_WoMdavA0KZGwvoL_KewybE',
  authDomain: 'my-keyworks.firebaseapp.com',
  databaseURL: 'https://my-keyworks.firebaseio.com',
  projectId: 'my-keyworks',
  storageBucket: 'my-keyworks.appspot.com',
  messagingSenderId: '666429890624'
}

firebase.initializeApp(config)
firebase.firestore().enablePersistence()

export default firebase
