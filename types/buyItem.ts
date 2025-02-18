import { type Timestamp } from "firebase/firestore"

interface BuyItem {
  id: string
  bodyText: string
  updatedAt: Timestamp
}

export type { BuyItem }
