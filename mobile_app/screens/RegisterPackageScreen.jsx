import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { paqueteRegister } from '../api/paquetes';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterPackageScreen({ navigation }) {
    const [peso, setPeso] = useState('');
    const [largo, setLargo] = useState('');
    const [ancho, setAncho] = useState('');
    const [alto, setAlto] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [loading, setLoading] = useState(false);

    const handleRegisterPackage = async () => {
        if (!peso || !largo || !ancho || !alto) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');

            const dimensiones = `${largo}x${ancho}x${alto}`; // -> formato largoxanchoxalto
            const data = { peso: parseFloat(peso), dimensiones, descripcion };

            const response = await paqueteRegister(data, token);

            if (response.status !== 201) {
                Alert.alert('Éxito', 'Paquete registrado correctamente');
            } else {
                throw new Error('Error al registrar el paquete');
            }


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

        <Text style={styles.label}>Dimensiones (cm):</Text>
        <TextInput
        placeholder="Largo"
        value={largo}
        onChangeText={setLargo}
        keyboardType="numeric"
        style={styles.input}
        />
        <TextInput
        placeholder="Ancho"
        value={ancho}
        onChangeText={setAncho}
        keyboardType="numeric"
        style={styles.input}
        />
        <TextInput
        placeholder="Alto"
        value={alto}
        onChangeText={setAlto}
        keyboardType="numeric"
        style={styles.input}
        />

        <TextInput
        placeholder="Descripción (opcional). Aquí puedes agregar cualquier detalle u observación"
        value={descripcion}
        onChangeText={setDescripcion}
        keyboardType="default"
        style={styles.input}
        />


        <Button
        title={loading ? 'Registrando...' : 'Registrar'}
        onPress={handleRegisterPackage}
        disabled={loading}
        />
        </View>
    
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    
    label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
    
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },

});
