import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import type { User } from '../types/auth'

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isAnonymous: firebaseUser.isAnonymous,
  }
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  return mapFirebaseUser(result.user)
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null)
  })
}

export function getCurrentUser(): User | null {
  const firebaseUser = auth.currentUser
  return firebaseUser ? mapFirebaseUser(firebaseUser) : null
}
