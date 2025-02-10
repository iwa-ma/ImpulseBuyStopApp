import { View, StyleSheet} from 'react-native'
import { router } from 'expo-router'

import BuyListItem from '../../components/BuyListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'

const handlePress = (): void => {
    router.push('/ImpulseBuyStop/create')
}

const List = ():JSX.Element => {
    return (
        <View style={styles.container}>
            <View>
                <BuyListItem />
                <BuyListItem />
                <BuyListItem />
            </View>
            <CircleButton onPress={handlePress}>
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