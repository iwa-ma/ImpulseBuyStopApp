import { View, Text,ScrollView, StyleSheet} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { onSnapshot, doc } from 'firebase/firestore'
import { useState, useEffect} from 'react'

import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'
import { auth, db } from '../../config'
import { type BuyItem } from '../../../types/buyItem'

const handlePress = (id: string): void => {
  router.push({ pathname: 'ImpulseBuyStop/edit', params: { id: id}})
}

const Detail = (): JSX.Element => {
  const  id  = String(useLocalSearchParams().id)
  console.log(id)
  const [item, setItems] = useState<BuyItem | null>(null)
  useEffect( () => {
    if (!auth.currentUser){return}
    const ref = doc(db, `users/${auth.currentUser.uid}/items`, id)
    const unsubscrive = onSnapshot(ref, (itemDoc) => {
      console.log(itemDoc)
      const { bodyText, updatedAt } = itemDoc.data() as BuyItem
      setItems({
        id: itemDoc.id,
        bodyText,
        updatedAt
      })
    })

    return unsubscrive
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
      <CircleButton onPress={() => {handlePress(id)}} style={{top:60,bottom: 'auto'}}>
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
  }
})

export default Detail
