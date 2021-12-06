import React from "react";
import { Image, StyleSheet } from 'react-native'

const LevelImage = ({index}) => {
    switch(index){
        case 0: return <Image style={styles.lvl_img} source={require('./img/lvl1.png')}/>; break;
        case 1: return <Image style={styles.lvl_img} source={require('./img/lvl1.png')}/>; break;
        case 2: return <Image style={styles.lvl_img} source={require('./img/lvl2.png')}/>; break;
        case 3: return <Image style={styles.lvl_img} source={require('./img/lvl3.png')}/>; break;
        case 4: return <Image style={styles.lvl_img} source={require('./img/lvl4.png')}/>; break;
        case 5: return <Image style={styles.lvl_img} source={require('./img/lvl5.png')}/>; break;
        case 6: return <Image style={styles.lvl_img} source={require('./img/lvl6.png')}/>; break;
        case 7: return <Image style={styles.lvl_img} source={require('./img/lvl7.png')}/>; break;
        default: return <Image style={styles.lvl_img} source={require('./img/lvl7.png')}/>; break;
    }
}

const styles = StyleSheet.create({
    lvl_img: {
        width: 130,
        height: 130,
        marginTop: -45
    }
});

export default LevelImage