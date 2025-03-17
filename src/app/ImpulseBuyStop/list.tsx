import {
  View, StyleSheet, FlatList,
  Text, Alert, ActivityIndicator
} from 'react-native'
import { router, useNavigation, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy ,getDocs, where } from 'firebase/firestore'
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

const List = ():JSX.Element => {
  // パラメーターとして、受け取ったanonymous(匿名ログイン状態)を定数定義
  const anonymous = useLocalSearchParams<{anonymous:string}>().anonymous

  const [items, setItems] = useState<OutPutBuyItem[] | null>(null)
  const navigation = useNavigation()
  const { setUnsubscribe } = useUnsubscribe()
  const [ priorityType , setPriorityType] = useState<priorityType[] | null>(null)

  /** code → 優先度名の変換を行う */
  function getpriorityName(id:number):string {
    // 優先度名が取得されていない場合は処理を実行ぜずに終了する
    if(!priorityType){return ''}
    const result = priorityType.find((type) => type.id == id)

    // codeに対応する優先度名が取得できた場合は結果を返す
    if(result){return result.name}

    // codeに対応する優先度名が取得できない場合は、空文字を返す
    return ''
  }

  /** 優先度名を取得 */
  async function getpriorityType():Promise<void> {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }

    // コレクションを取得して、更新日時の昇順でソート
    const ref = collection(db, 'priorityType')
    const q = query(ref, where("disabled", "==", false))
    const tempItems: priorityType[] = []
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc)=> {
        const { name, disabled,id} = doc.data()
        // 項目が有効な場合、リスト項目として追加
        if(!disabled){
          tempItems.push({
            id: id,
            name
          })
        }
      })

    // 取得結果でpriorityTypeを更新
    setPriorityType(tempItems)
  }

  // ヘッダーにポップアップメニュー表示処理
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <PopupMenu />}
    })
  }, [])

  // 優先度名リストを取得
  useEffect(() => {
    (async () =>{
      await getpriorityType()
    })()
  }, [])

  // リストデータ取得処理
  useEffect(() => {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }
    // 優先度名が取得されていない場合は処理を実行ぜずに終了する
    if(!priorityType) { return }

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
    // ドキュメントを取得して、出力用の配列を生成(リアルタイムリスナーで監視)
    const unsubscribe = onSnapshot(q, (snapshot) =>{
      const tempItems: OutPutBuyItem[] = []
      snapshot.forEach((doc)=> {
        const { bodyText, updatedAt, priority } = doc.data()

        // 出力用配列に追加
        // 優先度をgetpriorityName関数で変換(Id → 優先度名)
        tempItems.push({
          id: doc.id,
          bodyText,
          updatedAt,
          priority: getpriorityName(priority)
        })
      })

      // 出力用の配列を更新
      setItems(tempItems)
    })

    setUnsubscribe(() => unsubscribe)

    // コンポーネントアンマウント時、onSnapshotの監視を終了させる
    return unsubscribe
  }, [priorityType])

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
