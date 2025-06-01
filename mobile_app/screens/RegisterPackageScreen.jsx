import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { paqueteRegister } from '../api/paquetes';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterPackageScreen({ navigation }) {
    const [peso, setPeso] = useState('');
    const [dimensiones, setDimensiones] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegisterPackage = async () => {
        if (!peso || !dimensiones) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const data = { peso: parseFloat(peso), dimensiones };

            const response = await paqueteRegister(data, token);

            Alert.alert('Éxito', 'Paquete registrado correctamente');
            navigation.goBack(); // -> tambien podria ir al Main
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Registrar paquete</Text>
        <TextInput
        placeholder="Peso (kg)"
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
        style={styles.input}
        />
        <TextInput
        placeholder="Dimensiones (largo x ancho x alto)"
        value={dimensiones}
        onChangeText={setDimensiones}
        style={styles.input}
        />
        <Button title={loading ? 'Registrando...' : 'Registrar'} onPress={handleRegisterPackage} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
    },
});

