import { View, Text,ScrollView, StyleSheet} from 'react-native'
import Icon from '../../components/icon'

import Header from '../../components/Header'
import CircleButton from '../../components/CircleButton'

const Detail = () => {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>買いたい物リスト</Text>
                <Text style={styles.itemDate}>2025/2/26 2:25</Text>
            </View>
            <ScrollView style={styles.itemBody}>
                <Text style={styles.itemBodyText}>
                    買いたい物リスト
                    これがテストです。
                </Text>
            </ScrollView>
            <CircleButton style={{top:160,bottom: 'auto'}}>
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
        paddingVertical: 32,
        paddingHorizontal: 27
    },
    itemBodyText: {
        fontSize: 16,
        lineHeight: 24,
        color:'#000000'
    }
})

export default Detail
