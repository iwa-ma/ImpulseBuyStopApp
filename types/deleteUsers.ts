import { type Timestamp } from "firebase/firestore"

/** 削除ユーザー履歴の型定義 */
export type DeleteUsers = {
  UID: string
  id: string
  createdAt: Timestamp
}

