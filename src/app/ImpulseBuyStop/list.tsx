import { View, StyleSheet} from 'react-native'
import Header from '../../components/Header'
import BuyListItem from '../../components/BuyListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'

const List = ():JSX.Element => {
    return (
        <View style={styles.container}>
            <Header/>

            <BuyListItem />

            <BuyListItem />

            <BuyListItem />

            <CircleButton>
                <Icon name='plus' size={40} color='#FFFFFF' />
            </CircleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#ffffff'
    }
})

export default List