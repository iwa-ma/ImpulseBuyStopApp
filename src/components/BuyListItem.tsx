import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Link } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { auth, db } from 'config'
import { OutPutBuyItem } from 'types/outPutBuyItem'
import Icon from 'components/icon'

// スタイル定数
const COLORS = {
  white: '#ffffff',
  gray: '#848484',
  lightGray: '#B0B0B0',
  border: 'rgba(0,0,0,0.15)'
} as const

const FONT_SIZES = {
  normal: 16,
  small: 12
} as const

const SPACING = {
  padding: {
    vertical: 16,
    horizontal: 19
  },
  margin: {
    left: 10
  }
} as const

const LINE_HEIGHT = 32

/** list.tsxから受け取るprops型を定義 */
interface Props {
  /** リストアイテム */
  buyItem: OutPutBuyItem
  /** 匿名ログイン状態 */
  anonymous: string
}

/**
 * 削除アイコン選択動作
 *
 * @param id 選択されたリストアイテムのid
 * @param anonymous 匿名ログイン状態
 */
const handlePress = async (id: string, anonymous: string): Promise<void> => {
  if (!auth.currentUser) return

  if (anonymous === 'true') {
    Alert.alert(
      'お試し体験モード中はデータ削除できません。',
      'キャンセルを選択して下さい',
      [{ text: 'キャンセル' }]
    )
    return
  }

  const ref = doc(db, `buyItem/${auth.currentUser.uid}/items`, id)

  Alert.alert(
    '表示中のデータを削除します',
    '宜しいですか？',
    [
      { text: 'キャンセル' },
      {
        text: '削除する',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(ref)
            Alert.alert('削除が完了しました')
          } catch (error) {
            const message = error instanceof FirebaseError
              ? error.message
              : String(error)
            Alert.alert('削除に失敗しました', message)
          }
        }
      }
    ]
  )
}

/**
 * リストアイテム
 *
 * @param props
 * @returns {JSX.Element}
 */
const BuyListItem = ({ buyItem, anonymous }: Props): JSX.Element | null => {
  const { id, bodyText, updatedAt, priority } = buyItem

  if (!bodyText || !updatedAt) return null

  const dateString = updatedAt.toDate().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Link
      href={{ pathname: 'ImpulseBuyStop/detail', params: { id, anonymous }}}
      asChild
    >
      <TouchableOpacity style={styles.buyListItem}>
        <View>
          <Text numberOfLines={1} style={styles.buyListItemTitle}>
            {bodyText}
          </Text>
          <View style={styles.row}>
            <Text style={styles.buyListItemDate}>{dateString}</Text>
            <Text style={styles.buyListItemPriority}>{priority}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handlePress(id, anonymous)}>
          <Icon name='delete' size={32} color={COLORS.lightGray} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  buyListItem: {
    backgroundColor: COLORS.white,
    flexDirection: 'row' as const, //横方向に並べる
    justifyContent: 'space-between' as const, //要素の間にスペースいれる
    paddingVertical: SPACING.padding.vertical, // 縦方向のpadding
    paddingHorizontal: SPACING.padding.horizontal, // 横方向のpadding
    alignItems: 'center' as const, // 横方向の位置(flexDirectionを設定しているので、横方向が対象になる)
    borderBottomWidth: 1,
    borderColor: COLORS.border
  },
  buyListItemTitle: {
    fontSize: FONT_SIZES.normal,
    lineHeight: LINE_HEIGHT,
    flexDirection: 'row' as const
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const
  },
  buyListItemDate: {
    fontSize: FONT_SIZES.small,
    lineHeight: LINE_HEIGHT,
    color: COLORS.gray
  },
  buyListItemPriority: {
    marginLeft: SPACING.margin.left, // 左側にスペースをいれる
    fontSize: FONT_SIZES.normal
  }
})

export default BuyListItem
