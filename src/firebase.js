import firebase from 'firebase';
import { firebaseConfig } from './firebase.config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebaseApp.database();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();

export default firebase;
