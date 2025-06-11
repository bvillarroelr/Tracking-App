import Reac from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';




export default function DriverMainScreen({ navigation }) {






    return (
        <View style={styles.container}>
        <Text style={styles.text}>Hola, eres un conductor</Text>
        </View>
    );

}


const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },

});
