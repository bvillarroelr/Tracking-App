import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ClientMainSreen from './screens/ClientMainSreen';
import DriverMainScreen from './screens/DriverMainScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterPackageScreen from './screens/RegisterPackageScreen'
import ListPackagesScreen from './screens/ListPackagesScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>


        <Stack.Navigator initialRouteName="Login">

        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        <Stack.Screen name="ClientMain" component={ClientMainSreen} options={{ title: 'Inicio' }} />  
        <Stack.Screen name="DriverMain" component={DriverMainScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="RegisterPackage" component={RegisterPackageScreen} options={{ title: 'Registrar paquete' }} />
        <Stack.Screen name="ListPackages" component={ListPackagesScreen} options={{ title: 'Lista de paquetes' }} />

        </Stack.Navigator>

        </NavigationContainer>



    );
}

