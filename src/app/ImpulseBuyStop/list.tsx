import { View, StyleSheet, FlatList, Text } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment'

import BuyListItem from '../../components/BuyListItem'
import CircleButton from '../../components/CircleButton'
import CustomIcon from '../../components/icon'
import LogOutButton from '../../components/LogoutButton'
import { db, auth } from '../../config'
import { type BuyItem } from '../../../types/buyItem'

const handlePress = (): void => {
  router.push('/ImpulseBuyStop/create')
}

const List = ():JSX.Element => {
  const [items, setItems] = useState<BuyItem[]>([])
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton />}
    })
  }, [])

  useEffect(() => {
      // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }

    // コレクションを取得して、更新日時の昇順でソート
    const ref = collection(db, `users/${auth.currentUser.uid}/items`)
    const q = query(ref, orderBy('updatedAt', 'asc'))

    // ドキュメントを取得して、出力用の配列を生成
    const unsubscrive = onSnapshot(q, (snapshot) =>{
      const tempItems: BuyItem[] = []
      snapshot.forEach((doc)=> {
        const { bodyText, updatedAt } = doc.data()
        tempItems.push({
          id: doc.id,
          bodyText,
          updatedAt
        })
      })

      // 出力用の配列を更新
      setItems(tempItems)
    })
    // onSnapshotの監視を終了させる
    return unsubscrive
  }, [])

  return (
    <View style={styles.container}>

      {/* 取得データが0件の場合、FlatListではなくメッセージを表示 */}
      {items.length === 0
        ? <Text style={styles.nodetaWrap}>
            <Text style={styles.nodetaTextStyle}>表示するデータがありません。</Text>
            <FontAwesomeIcon size={24} icon={faComment} />
          </Text>
        : <FlatList
            data={items}
            renderItem={({ item }) => { return <BuyListItem key={item.id} buyItem={item} /> }}
      />
      }

      <CircleButton onPress={handlePress}>
        <CustomIcon name='plus' size={40} color='#FFFFFF' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#ffffff'
  },
  nodetaWrap: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  nodetaTextStyle: {
    fontSize: 24
  }
})

export default List
