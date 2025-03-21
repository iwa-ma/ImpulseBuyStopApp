import { type Timestamp } from "firebase/firestore"

/** リスト表示データ1件毎の型定義 */
export type OutPutBuyItem = {
  id: string
  bodyText: string
  updatedAt: Timestamp
  priority: string
}
