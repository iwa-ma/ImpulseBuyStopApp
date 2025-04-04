import { Text, TouchableOpacity, StyleSheet } from 'react-native'

// スタイル定数
const COLORS = {
  primary: '#467FD3',
  white: '#FFFFFF'
} as const

const FONT_SIZES = {
  normal: 16
} as const

const SPACING = {
  padding: {
    vertical: 8,
    horizontal: 24
  }
} as const

const BORDER_RADIUS = 4

/** ボタンスタイルの型定義 */
type ButtonStyle = {
  marginTop?: number
  marginBottom?: number
  marginRight?: number
  marginLeft?: number
  backgroundColor?: string
  opacity?: number
}

/** 親コンポーネントから受け取るprops型を定義 */
interface Props {
  /** ボタンラベルに表示する文字列 */
  label: string
  /** ボタン有効状態 */
  disabled?: boolean
  /** ボタンのスタイル設定 */
  buttonStyle?: ButtonStyle
  /** クリックイベントハンドラ */
  onPress?: () => void
}

/**
 * 共通ボタンコンポーネント
 */
const Button = ({ label, onPress, buttonStyle, disabled = false }: Props): JSX.Element => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    style={[styles.button, buttonStyle]}
    activeOpacity={0.7}
  >
    <Text style={styles.buttonLabel}>{label}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    alignSelf: 'flex-start' as const
  },
  buttonLabel: {
    fontSize: FONT_SIZES.normal,
    lineHeight: 32,
    color: COLORS.white,
    paddingVertical: SPACING.padding.vertical,
    paddingHorizontal: SPACING.padding.horizontal
  }
})

export default Button
