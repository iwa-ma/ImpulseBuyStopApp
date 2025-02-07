import { View, StyleSheet} from 'react-native'
import Header from '../components/Header'
import BuyListItem from '../components/BuyListItem'
import CircleButton from '../components/CircleButton'
const Index = ():JSX.Element => {
    return (
        <View style={styles.container}>
            <Header/>

            <BuyListItem />

            <BuyListItem />

            <BuyListItem />

            <CircleButton>+</CircleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#ffffff'
    }
})

export default Index