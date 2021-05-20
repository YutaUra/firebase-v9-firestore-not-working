import { FirebaseApp, getApps, initializeApp } from 'firebase/app'
import { FirebaseFirestore, getFirestore } from 'firebase/firestore'
import { atom, selector } from 'recoil'

export const getAppDefault = () => {
  const apps = getApps()
  if (apps.length > 0) return apps[0]
  return initializeApp({
    apiKey: 'AIzaSyArw-x8CKd8tiyAOIf5wFGSReCyHnhW7G4',
    authDomain: 'firestore-v9-not-working.firebaseapp.com',
    projectId: 'firestore-v9-not-working',
    storageBucket: 'firestore-v9-not-working.appspot.com',
    messagingSenderId: '469025378100',
    appId: '1:469025378100:web:349b12f40b8ab478739f61',
  })
}

export const FirebaseAppAtom = atom<FirebaseApp>({
  key: 'FirebaseAppAtom',
  default: getAppDefault(),
  dangerouslyAllowMutability: true, // Firebase App is not freezable object
})

export const FirebaseFirestoreSelector = selector<FirebaseFirestore>({
  key: 'FirebaseFirestoreSelector',
  get: ({ get }) => {
    const app = get(FirebaseAppAtom)
    const db = getFirestore(app)
    return db
  },
  // If `dangerouslyAllowMutability` is false, it doesnt work
  dangerouslyAllowMutability: true, // Firebase Firestore is not freezable object
})
