import { View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { Link } from 'expo-router'

import Icon from './icon'

const BuyListItem = (): JSX.Element => {
  return (
    <Link href='ImpulseBuyStop/detail' asChild>
      <TouchableOpacity style={styles.buyListItem}>
        <View>
          <Text style={styles.buyListItemTitle}>ヤフーオークション</Text>
          <Text style={styles.buyListItemDate}>2025/2/26 2:25</Text>
        </View>
        <TouchableOpacity>
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
