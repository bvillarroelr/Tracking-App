import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';


export default function RutaScreen({ route }) {
    const { destinoLat, destinoLng } = route.params;


    const origen = {
        latitude: -36.8263,
        longitude: -73.0493,
    };

    const destino = {
        latitude: destinoLat,
        longitude: destinoLng,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: (origen.latitude + destino.latitude) / 2,
                    longitude: (origen.longitude + destino.longitude) / 2,
                    latitudeDelta: Math.abs(origen.latitude - destino.latitude) + 0.1,
                    longitudeDelta: Math.abs(origen.longitude - destino.longitude) + 0.1,
                }}
            >
                <Marker coordinate={origen} title="Origen" />
                <Marker coordinate={destino} title="Destino" />

                <MapViewDirections
                    origin={origen}
                    destination={destino}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={4}
                    strokeColor="blue"
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
