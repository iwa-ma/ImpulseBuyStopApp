import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

import fontData from '@assets/fonts/icomoon.ttf'
import fontSelection from '@assets/fonts/selection.json'

// フォント設定
const FONT_CONFIG = {
  fontFamily: 'IcoMoon',
  fontFile: 'icomoon.ttf'
} as const

// カスタムアイコンセットの作成
const CustomIcon = createIconSetFromIcoMoon(
  fontSelection,
  FONT_CONFIG.fontFamily,
  FONT_CONFIG.fontFile
)

/** アイコンのプロパティ型定義 */
interface Props {
  /** アイコン名 */
  name: string
  /** アイコンサイズ */
  size: number
  /** アイコン色 */
  color: string
}

/**
 * アイコン(vector-iconsをwrapしたコンポーネント)
 *
 * @param props
 * @returns {JSX.Element}
 */
const Icon = ({ name, size, color }: Props): JSX.Element | null => {
  const [fontLoaded] = useFonts({
    [FONT_CONFIG.fontFamily]: fontData
  })

  if (!fontLoaded) return null

  return (
    <CustomIcon
      name={name}
      size={size}
      color={color}
    />
  )
}

export default Icon