import {
  View, StyleSheet, FlatList,
  Text, Alert, ActivityIndicator
} from 'react-native'
import { router, useNavigation, useLocalSearchParams } from 'expo-router'
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

/**
 * 新規追加アイコン選択動作
 *
 */
const handlePress = (anonymous: string): void => {
  if (!auth.currentUser) { return }

  // 匿名ログインの場合、警告表示して処理終了
  if( anonymous === 'true' ){
    Alert.alert('お試し体験モード中はデータ追加できません。','キャンセルを選択して下さい',[
      {
        text:'キャンセル'
      }
    ])
    return
  }

  router.push('/ImpulseBuyStop/create')
}

/**
 * リストの表示処理
 * @items リスト表示データ
 * @anonymous 匿名ログイン状態
 */
const buyList = (items: BuyItem[] | null,anonymous: string): JSX.Element => {
  // ローディング中(itemsがnull)はインジケータを表示
  if(!items){
    return (<ActivityIndicator size={120} style={styles.loadingWrap}/> )
  }

  // 取得データが0件の場合、FlatListではなくメッセージを表示
  if(items.length === 0){
    return (
      <Text style={styles.nodetaWrap}>
        <Text style={styles.nodetaTextStyle}>表示するデータがありません。</Text>
        <FontAwesomeIcon size={24} icon={faComment} />
      </Text>
    )
  }else{
    return (
      <FlatList
            data={items}
            renderItem={({ item }) => { return <BuyListItem key={item.id} buyItem={item} anonymous={anonymous} /> }}
      />
    )
  }
}

const List = ():JSX.Element => {
  // パラメーターとして、受け取ったanonymous(匿名ログイン状態)を定数定義
  const anonymous = useLocalSearchParams<{anonymous:string}>().anonymous

  const [items, setItems] = useState<BuyItem[] | null>(null)
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton />}
    })
  }, [])

  useEffect(() => {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }

    let collectionPath = ''
    if(anonymous === 'true'){
      // collectionPathにサンプルデータのパスを指定
      collectionPath  = 'users/sample9999/items'
    }else{
      // collectionPathにログイン中ユーザーのパスを指定
      collectionPath  = `users/${auth.currentUser?.uid}/items`
    }

    // コレクションを取得して、更新日時の昇順でソート
    const ref = collection(db, collectionPath)
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
      {buyList(items,anonymous)}

      <CircleButton onPress={() => { handlePress(anonymous)}}>
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
  loadingWrap: {
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
