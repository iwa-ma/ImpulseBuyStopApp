import { type Timestamp } from "firebase/firestore"
import { type priorityType} from './priorityType'

interface BuyItem {
  id?: string
  bodyText: string
  updatedAt: Timestamp
  priority: priorityType["id"]
}

export type { BuyItem }
