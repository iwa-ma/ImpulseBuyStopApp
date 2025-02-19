import { View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import { Link } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'

import Icon from './icon'
import { type BuyItem } from '../../types/buyItem'
import { auth, db } from '../config'

interface Props {
  buyItem: BuyItem
}

const handlePress = (id: string): void => {
  if (!auth.currentUser) { return }
  const ref = doc(db, `users/${auth.currentUser.uid}/items`, id)

  Alert.alert('表示中のデータを削除します','宜しいですか？',[
    {
      text:'キャンセル'
    },
    {
      text:'削除する',
      style: 'destructive',
      onPress: () => {
        deleteDoc(ref)
          .catch(() => { Alert.alert('削除に失敗しました')})
      }
    }
  ])

}

const BuyListItem = (props: Props): JSX.Element | null => {
  const { buyItem } = props
  const { id ,bodyText , updatedAt } = buyItem
  if ( !bodyText || !updatedAt ) { return null}
  const dateString = updatedAt.toDate().toLocaleDateString('ja-JP')
  return (
    <Link
      href={{ pathname: 'ImpulseBuyStop/detail', params: { id: id}}} asChild>
      <TouchableOpacity style={styles.buyListItem}>
        <View>
          <Text numberOfLines={1} style={styles.buyListItemTitle}>{bodyText}</Text>
          <Text style={styles.buyListItemDate}>{dateString}</Text>
        </View>
        <TouchableOpacity onPress={() => { handlePress(id)}}>
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
    lineHeight:32 // 行の高さ
  },
  buyListItemDate: {
    fontSize:12,
    lineHeight:32, // 行の高さ
    color:'#848484'
  }
})

export default BuyListItem
