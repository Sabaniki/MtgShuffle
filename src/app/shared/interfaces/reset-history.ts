import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface ResetHistory {
  lastUpdate: Timestamp;
}
