import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { listaPaquetesConRuta } from '../api/paquetes';

export default function DriverMainScreen() {
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPaquetes = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }

            const data = await listaPaquetesConRuta(token); // Debe filtrar solo los paquetes con ruta
            setPaquetes(data);
            setError('');

        } catch (error) {
            console.error('Error cargando paquetes:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPaquetes();
    }, []);


    const renderItem = ({ item }) => (
        <View style={styles.card}>
        <Text style={styles.label}>ID:</Text>
        <Text>{item.paquete_id}</Text>

        <Text style={styles.label}>Cliente:</Text>
        <Text>{item.usuario_nombre} {item.usuario_apellido}</Text>

        <Text style={styles.label}>Destino:</Text>
        <Text>{item.paquete_destino}</Text>

        <Text style={styles.label}>Peso:</Text>
        <Text>{item.paquete_peso} kg</Text>

        <Text style={styles.label}>Descripción:</Text>
        <Text>{item.paquete_descripcion}</Text>


        <Text style={styles.label}>Ruta:</Text>
        <Text style={{ color: 'green' }}>Ruta Asignada</Text>


        </View>
    );

    return (
        <View style={styles.container}>
        <Text style={styles.title}>📦 Paquetes con Ruta Asignada</Text>

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
            <Text style={styles.error}>{error}</Text>
        ) : paquetes.length === 0 ? (
            <Text>No hay paquetes con ruta.</Text>
        ) : (
            <FlatList
            data={paquetes}
            keyExtractor={(item) => item.paquete_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            />
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    list: {
        paddingBottom: 30,
    },
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    error: {
        color: 'red',
        alignSelf: 'center',
    },
});
