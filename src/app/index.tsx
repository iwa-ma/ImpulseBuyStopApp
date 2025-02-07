import { View, Text,StyleSheet} from 'react-native'

const Index = ():JSX.Element => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerInner}>
                    <Text style={styles.headerTitle}>Impulse Buy Stop App</Text>
                    <Text style={styles.headerRight}>ログアウト</Text>
                </View>
            </View>

            <View style={styles.buyListItem}>
                <View>
                    <Text style={styles.buyListItemTitle}>ヤフーオークション</Text>
                    <Text style={styles.buyListItemDate}>2025/2/26 2:25</Text>
                </View> 
                <View>
                    <Text>X</Text>
                </View>
            </View>

            <View style={styles.buyListItem}>
                <View>
                    <Text style={styles.buyListItemTitle}>メルカリ</Text>
                    <Text style={styles.buyListItemDate}>2025/2/27 3:25</Text>
                </View> 
                <View>
                    <Text>X</Text>
                </View>
            </View>

            <View style={styles.circleButton}>
                    <Text style={styles.circleButtonLabel}>+</Text>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#ffffff'
    },
    header: {
        backgroundColor: '#0E75FC',
        height: 104,
        justifyContent:'flex-end'
    },
    headerInner: {
        alignItems:'center'
    },
    headerRight: {
        position:'absolute',
        right:16,
        bottom:16,
        color: 'rgba(255,255,255,0.7)'
    },
    headerTitle: {
        marginBottom: 8,
        fontSize: 22,
        lineHeight:32,
        fontWeight:'bold',
        color:'#ffffff'
    },
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
    },
    circleButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#467FD3',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right:40,
        bottom:40,
        shadowColor: '#000000', // iosのみ
        shadowOpacity: 0.25, // iosのみ
        shadowRadius: 8, // iosのみ
        shadowOffset: { width: 0, height:8}, // iosのみ
        elevation: 8 // androidで影をつける
    },
    circleButtonLabel: {
        color: '#ffffff',
        fontSize:40,
        lineHeight:48


    }

})

export default Index