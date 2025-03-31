import { View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import { Link } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

import Icon from './icon'
import { auth, db } from '../config'
import { OutPutBuyItem } from '../app/../../types/outPutBuyItem'

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
const handlePress = (id: string,anonymous: string): void => {
  if (!auth.currentUser) { return }

  if(anonymous === 'true'){
    Alert.alert('お試し体験モード中はデータ削除できません。','キャンセルを選択して下さい',[
      {
        text:'キャンセル'
      }
    ])
    return
  }

  const ref = doc(db, `buyItem/${auth.currentUser.uid}/items`, id)

  Alert.alert('表示中のデータを削除します','宜しいですか？',[
    {
      text:'キャンセル'
    },
    {
      text:'削除する',
      style: 'destructive',
      onPress: async () => {
        try {
          await deleteDoc(ref)
          Alert.alert('削除が完了しました')
        } catch (error: unknown) {
          if (error instanceof FirebaseError) {
            const { message }: { message: string } = error
            Alert.alert('削除に失敗しました\n'+message)
          } else {
            Alert.alert('削除に失敗しました\n'+error)
          }
        }
      }
    }
  ])

}

/**
 * リストアイテム
 *
 * @param props
 * @returns {JSX.Element}
 */
const BuyListItem = (props: Props): JSX.Element | null => {
  const { buyItem,anonymous } = props
  const { id ,bodyText , updatedAt, priority } = buyItem

  if ( !bodyText || !updatedAt ) { return null}
  const dateString = updatedAt.toDate().toLocaleDateString('ja-JP')

  return (
    <Link
      href={{ pathname: 'ImpulseBuyStop/detail', params: { id: id, anonymous:anonymous}}} asChild>
      <TouchableOpacity style={styles.buyListItem}>
        <View>
          <Text numberOfLines={1} style={styles.buyListItemTitle}>{bodyText}</Text>
          <View style={styles.row}>
            <Text style={styles.buyListItemDate}>{dateString}</Text>
            <Text style={styles.buyListItemPriority}>{priority}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => { handlePress(id, anonymous)}}>
          <Icon name='delete' size={32} color='#B0B0B0' />
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  buyListItem: {
    backgroundColor:'#ffffff',
    flexDirection:'row', //横方向に並べる
    justifyContent: 'space-between', //要素の間にスペースいれる
    paddingVertical: 16, // 縦方向のpadding
    paddingHorizontal: 19, // 横方向のpadding
    alignItems:'center', // 横方向の位置(flexDirectionを設定しているので、横方向が対象になる)
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)'
  },
  buyListItemTitle: {
    fontSize:16,
    lineHeight:32,// 行の高さ
    flexDirection:'row'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buyListItemDate: {
    fontSize:12,
    lineHeight:32, // 行の高さ
    color:'#848484'
  },
  buyListItemPriority: {
    marginLeft: 10, // 日付と優先度の間にスペースを追加
    fontSize:16
    // 他のスタイル
  }
})

export default BuyListItem
