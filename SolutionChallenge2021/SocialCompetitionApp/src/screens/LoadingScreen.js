import React, {useContext, useEffect} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Image} from 'react-native'
import {uStyles, colors} from '../styles.js'
import LottieView from 'lottie-react-native';

import {UserContext} from '../context/UserContext'
import {FirebaseContext} from '../context/FirebaseContext'

export default LoadingScreen = () => {
    const [_, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        setTimeout(async () => {
            const user = firebase.getCurrentUser();

            if (user) {
                const userInfo = await firebase.getUserData(user.uid);
                setUser({
                    isLoggedIn: true,
                    email: userInfo.email,
                    uid: user.uid,
                    username: userInfo.username,
                    profilePhotoUrl: userInfo.profilePhotoUrl
                })
            } else {
                setUser(state => ({...state, isLoggedIn: false}));
            }
        }, 1000);
    }, [])

    return (
        <View style={{alignItems: "center", height: "100%", width: "100%", marginTop: 0}} backgroundColor={colors.dark}>
            <Image source={require('../../assets/img/Logo.png')} style={{marginTop: 200}}/>
            <LottieView source={require("../../assets/51-preloader.json")} autoPlay loop style={{width: "100%"}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
        justifyContent: "center"
    },
});
