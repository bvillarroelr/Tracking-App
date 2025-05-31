import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './screens/MainSreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>


        <Stack.Navigator initialRouteName="Main">

        <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Inicio' }} />   


        </Stack.Navigator>

        </NavigationContainer>



    );
}

