import { Text, TouchableOpacity, StyleSheet } from 'react-native'

/** 親コンポーネントから受け取るprops型を定義 */
interface Props {
  /** ボタンラベルに表示する文字列 */
  label: string,
  /** ボタン有効状態 */
  disabled?: boolean
  /** ボタンのスタイル設定(必要に応じて追加) */
  buttonStyle?:{
    marginTop?: number
    marginBottom?: number,
    marginRight?: number,
    marginLeft?: number,
    backgroundColor?: string,
    opacity?: number,
  }
  onPress?: () => void
}

const Button = (props: Props):JSX.Element => {
  const { label, onPress, buttonStyle, disabled } = props

  return (
    <TouchableOpacity
      disabled={typeof(disabled) === 'undefined'  ? false : disabled}
      onPress={onPress}
      style={[styles.button, buttonStyle]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#467FD3',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 32,
    color: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 24
  }
})

export default Button
