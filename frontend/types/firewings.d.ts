
declare module 'firewings' {
  import { firestore } from 'firebase'
  type DocumentReference = firestore.DocumentReference
  type CollectionReference = firestore.CollectionReference
  type Query = firebase.firestore.Query<firebase.firestore.DocumentData>

  export const queryFirestore: (query: DocumentReference | CollectionReference | Query, asObject?: boolean) => Promise<any>
  /***************************************************/
  /** Takes a Snapshot and returns the queried item */
  /** adding _id and _path to the queried document  */
  /**************************************************/
  }
