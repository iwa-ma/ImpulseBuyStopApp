import {
  Text,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle
} from 'react-native'

// スタイル定数
const COLORS = {
  primary: '#467FD3',
  white: '#ffffff',
  shadow: '#000000'
} as const

const SIZES = {
  button: {
    width: 64,
    height: 64,
    borderRadius: 32
  },
  position: {
    right: 40,
    bottom: 40
  },
  shadow: {
    opacity: 0.25,
    radius: 8,
    offset: { width: 0, height: 8 },
    elevation: 8
  },
  text: {
    fontSize: 40,
    lineHeight: 48
  }
} as const

/** 親コンポーネントから受け取るprops型を定義 */
interface Props {
  /** ボタン内に表示する要素 */
  children: JSX.Element
  /** カスタムスタイル */
  style?: ViewStyle
  /** クリックイベントハンドラ */
  onPress?: () => void
}

/**
 * 共通円形ボタン
 *
 * @param props
 * @returns {JSX.Element}
 */
const CircleButton = ({ children, style, onPress }: Props): JSX.Element => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.circleButton, style]}
    activeOpacity={0.7}
  >
    <Text style={styles.circleButtonLabel}>{children}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  circleButton: {
    width: SIZES.button.width,
    height: SIZES.button.height,
    borderRadius: SIZES.button.borderRadius,
    backgroundColor: COLORS.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'absolute' as const,
    right: SIZES.position.right,
    bottom: SIZES.position.bottom,
    shadowColor: COLORS.shadow, // iosのみ
    shadowOpacity: SIZES.shadow.opacity, // iosのみ
    shadowRadius: SIZES.shadow.radius, // iosのみ
    shadowOffset: SIZES.shadow.offset, // iosのみ
    elevation: SIZES.shadow.elevation
  },
  circleButtonLabel: {
    color: COLORS.white,
    fontSize: SIZES.text.fontSize,
    lineHeight: SIZES.text.lineHeight
  }
})

export default CircleButton
