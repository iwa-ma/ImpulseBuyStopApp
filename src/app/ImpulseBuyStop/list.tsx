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
import { db, auth } from '../../config'
import PopupMenu from '../../components/PopupMenu'
import { useUnsubscribe } from '../UnsubscribeContext'
import { type priorityType} from '../../../types/priorityType'
import { OutPutBuyItem } from '../../app/../../types/outPutBuyItem'
import { getpriorityType,getpriorityName } from '../../utils/priorityUtils'
import  ListSort from './listSort'
import { type SortType,OrderByDirection } from '../../app/../../types/list'
import { FirebaseError } from 'firebase/app'

/**
 * 新規追加アイコン選択動作
 *
 * @param anonymous 匿名ログイン状態
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
const buyList = (items: OutPutBuyItem[] | null,anonymous: string): JSX.Element => {
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

/**
 * リスト画面
 *
 * @returns {JSX.Element}
 */
const List = ():JSX.Element => {
  // パラメーターとして、受け取ったanonymous(匿名ログイン状態)を定数定義
  const anonymous = useLocalSearchParams<{anonymous:string}>().anonymous

  const [items, setItems ] = useState<OutPutBuyItem[] | null>(null)
  const navigation = useNavigation()
  const { setUnsubscribe } = useUnsubscribe()
  const [ priorityType , setPriorityType ] = useState<priorityType[]>([])

  // 優先度のソートタイプ
  const [ itemsSortType, setItemsSortType ] = useState<SortType>('updatedAt')
  // 優先度のソート順
  const [ itemsSortOrder, setItemsSortOrder ] = useState<OrderByDirection>('desc')

  // ヘッダーにポップアップメニュー表示処理
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <PopupMenu />}
    })
  }, [])

  // 優先度名リストを取得
  useEffect(() => {
    (async () =>{
      await getpriorityType({setPriorityType})
    })()
  }, [])

  // リストデータ取得処理
  useEffect(() => {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }
    // 優先度名が取得されていない場合は処理を実行ぜずに終了する
    if(!priorityType) { return }

    setItems([])
    let collectionPath = ''
    if(anonymous === 'true'){
      // collectionPathにサンプルデータのパスを指定
      collectionPath  = 'users/sample9999/items'
    }else{
      // collectionPathにログイン中ユーザーのパスを指定
      collectionPath  = `users/${auth.currentUser?.uid}/items`
    }

    // コレクションを取得して、指定された項目の指定順でソート
    const ref = collection(db, collectionPath)
    const q = query(ref, orderBy(itemsSortType, itemsSortOrder))

    // ドキュメントを取得して、出力用の配列を生成(リアルタイムリスナーで監視)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const tempItems: OutPutBuyItem[] = []
        snapshot.forEach((doc) => {
          // Firestoreからデータを型付けして取得
          const data = doc.data()
          if (data) {
            // 出力用配列に追加
            // 優先度をgetpriorityName関数で変換(code → 優先度名)
            const buyItem: OutPutBuyItem = {
              id: doc.id, // idはコレクション要素として不可していないので、ドキュメントオブジェクトから取得する
              bodyText: data.bodyText,
              updatedAt: data.updatedAt,
              priority: getpriorityName(priorityType, data.priority)
            }
            tempItems.push(buyItem)
          }
        })

        // 出力用の配列を更新
        setItems(tempItems)
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          const { message } = error
          Alert.alert(
            'エラーが発生しました',
            'データの取得中にエラーが発生しました。もう一度お試しください。' + message
          )
        } else {
          Alert.alert(
            'エラーが発生しました',
            'データの取得中にエラーが発生しました。もう一度お試しください。'
          )
        }
      }
    })

    setUnsubscribe(() => unsubscribe)

    // コンポーネントアンマウント時、onSnapshotの監視を終了させる
    return unsubscribe
  }, [priorityType,itemsSortType,itemsSortOrder])

  return (
    <View style={styles.container}>
      {/* リストソートUI */}
      <ListSort
        itemsSortType={itemsSortType}
        itemsSortOrder={itemsSortOrder}
        setItemsSortType={setItemsSortType}
        setItemsSortOrder={setItemsSortOrder}
      />

      {/* リスト表示 */}
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
