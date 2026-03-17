import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

if (!getApps().length) {
  initializeApp({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  })
}

export const db = getFirestore()
export const bucket = getStorage().bucket()