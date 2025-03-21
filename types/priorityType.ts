/** 優先度項目の型定義 */
export type priorityType = {
  /** タイプno */
  id: number
  /** 優先度名 */
  name: string
  /** 項目無効化状態 (真の場合無効)  */
  disabled?:boolean
}
