import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, Alert } from 'react-native';

import { paqueteList } from '../api/paquetes'

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListPackagesScreen({ navigation })
{
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const loadPaquetes = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }

            const data = await paqueteList(token);
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
    }, [])

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPaquetes();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PackageDetailScreen', { paqueteId: item.id })}
        >
        <Text style={styles.title}>📦 Paquete #{item.id}</Text>
        <Text>Peso: {item.peso} kg</Text>
        <Text>Dimensiones: {item.dimensiones}</Text>
        <Text>Fecha de envío: {item.fecha_envio}</Text>
        <Text>Estado: {item.estado}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
            <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <FlatList
        data={paquetes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay paquetes registrados.</Text>}
        />
        </View>
    );
    
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
    },

    card: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        elevation: 2,
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
     
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },

    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },

});
