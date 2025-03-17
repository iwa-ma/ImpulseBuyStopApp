import { type Timestamp } from "firebase/firestore"

interface OutPutBuyItem {
  id: string
  bodyText: string
  updatedAt: Timestamp
  priority: string
}

export type { OutPutBuyItem }
