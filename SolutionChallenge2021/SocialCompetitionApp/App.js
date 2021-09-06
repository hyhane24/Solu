import * as firebase from 'firebase'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'

import AppStackScreens from './src/stacks/AppStackScreens'
import {UserProvider} from './src/context/UserContext'
import {FirebaseProvider} from './src/context/FirebaseContext'
import { SettingsProvider } from './src/context/SettingsContext'

export default App = () => {
    console.disableYellowBox = true; // hides logs in simulator for presentation purposes

    return (
        <FirebaseProvider>
            <UserProvider>
                <SettingsProvider>
                    <NavigationContainer>
                        <AppStackScreens/>
                    </NavigationContainer>
                </SettingsProvider>
            </UserProvider>
        </FirebaseProvider>
    )
}