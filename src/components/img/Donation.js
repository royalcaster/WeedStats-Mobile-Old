import react from 'react';
import { StyleSheet, Image} from 'react-native';

const Donation = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Du willst<Text style={[styles.text, styles.bold]}>WeedStats</Text>unterstützen?</Text>
            <Image source={require('./img/döner.png')} style={styles.image}></Image>
            <Text>Gib uns einen Döner aus!</Text>
        </View>
    )
}

export default Donation

const styles = StyleSheet.create({
    container: {

    },
    text: {

    },
    bold: {

    },
    image: {
        
    }
});