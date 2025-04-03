import { type Timestamp } from "firebase/firestore"
import { type priorityType} from './priorityType'

/** 登録データ1件毎のデータ型 */
export type BuyItem = {
  id?: string
  bodyText: string
  updatedAt: Timestamp
  priority: priorityType["id"]
}
