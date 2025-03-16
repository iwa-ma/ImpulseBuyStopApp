import { View, Text,ScrollView, StyleSheet, Alert} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { collection, onSnapshot, query, doc ,getDocs, where } from 'firebase/firestore'
import { type priorityType} from '../../../types/priorityType'

import { useState, useEffect} from 'react'

import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'
import { auth, db } from '../../config'
import { type BuyItem } from '../../../types/buyItem'

/**
 * 編集アイコン選択動作
 *
 * @param id 選択されたリストアイテムのid
 * @param anonymous 匿名ログイン状態
 */
const handlePress = (id: string,anonymous: string): void => {
  if(anonymous === 'true'){
    Alert.alert('お試し体験モード中はデータ編集できません。','キャンセルを選択して下さい',[
      {
        text:'キャンセル'
      }
    ])
    return
  }

  router.push({ pathname: 'ImpulseBuyStop/edit', params: { id: id}})
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  console.log(id)
  const anonymous = useLocalSearchParams<{anonymous:string}>().anonymous
  const [ priorityType , setPriorityType] = useState<priorityType[] | null>(null)

  function getpriorityName(id:number):string {

    if(!priorityType){return ''}
    const result = priorityType.find((type) => type.id == id)
    // console.log('result:'+result)

    if(result){return result.name}

    return ''
  }

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

    setPriorityType(tempItems)
  }

  let docPath = ''
  if(anonymous === 'true'){
    // docPathにサンプルデータのパスを指定
    docPath = 'users/sample9999/items'
  }else{
    // docPathにログイン中ユーザーのパスを指定
    docPath = `users/${auth.currentUser?.uid}/items`
  }

  const [item, setItems] = useState<BuyItem | null>(null)
  useEffect( () => {
    if (!auth.currentUser){return}
    const ref = doc(db, docPath, id)
    const unsubscrive = onSnapshot(ref, (itemDoc) => {
      const { bodyText, updatedAt,priority } = itemDoc.data() as BuyItem
      setItems({
        id: itemDoc.id,
        bodyText,
        updatedAt,
        priority
      })
    })

    return unsubscrive
  },[])

  useEffect( () => {
    (async () =>{
      await getpriorityType()
    })()
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item?.bodyText}</Text>
        <Text style={styles.itemDate}>{item?.updatedAt.toDate().toLocaleDateString('ja-JP')}</Text>
      </View>
      <ScrollView style={styles.itemBody}>
        <Text style={styles.itemBodyText}>
          {item?.bodyText}
        </Text>
      </ScrollView>

      {/* 優先度 */}
      <View style={styles.itemPriorityText}>
        <Text>優先度:{item?.priority ? getpriorityName(item?.priority) : null}</Text>
      </View>

      <CircleButton onPress={() => {handlePress(id,anonymous)}} style={{top:60,bottom: 'auto'}}>
        <Icon name='pencil' size={40} color='#FFFFFF' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#FFFFFF'
  },
  itemHeader: {
    backgroundColor: '#0E75FC',
    height: 96,
    justifyContent: 'center',
    paddingVertical: 24, //縦方向
    paddingHorizontal: 19 //横方向
  },
  itemTitle: {
    color: '#ffffff',
    fontSize:20,
    lineHeight:32,
    fontWeight: 'bold'
  },
  itemDate: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16
  },
  itemBody :{
    paddingHorizontal: 27
  },
  itemBodyText: {
    paddingVertical: 32,
    fontSize: 16,
    lineHeight: 24,
    color:'#000000'
  },
  itemPriorityText: {
    paddingBottom:16,
    paddingLeft:16
  }
})

export default Detail
