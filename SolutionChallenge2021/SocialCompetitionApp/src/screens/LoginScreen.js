import React, {useState, useContext} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, KeyboardAvoidingView} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import * as firebase from 'firebase'

import {uStyles, colors} from '../styles'
import {FirebaseContext} from "../context/FirebaseContext"
import {UserContext} from '../context/UserContext'

export default LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);   
    const firebase = useContext(FirebaseContext);
    const [_, setUser] = useContext(UserContext);

    const handleLogin = async () => {
        setLoading(true);

        try {
            await firebase.logIn(email, password);

            const uid = firebase.getCurrentUser().uid;
            const userInfo = await firebase.getUserData(uid);
            const emailVerified = firebase.getCurrentUser().emailVerified;

            if (!emailVerified) {
                setErrorMessage("Your email is not verified. Check your inbox.");
            }

            setUser({
                username: userInfo.username,
                email: userInfo.email,
                uid,
                profilePhotoUrl: userInfo.profilePhotoUrl,
                isLoggedIn: emailVerified,
            });
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = () => {
        try {
            firebase.sendPasswordResetEmail(email);
            setErrorMessage("Email sent!");
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const resendVerification = () => {
        try {
            firebase.sendEmailVerification();
            setErrorMessage("Email sent!");
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return(
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
            <ImageBackground style={{width: "100%", height: "100%", borderRadius: 20}} source={require("../../assets/background.png")} imageStyle={{borderRadius: 20}}>

            <ScrollView contentContainerStyle={{paddingBottom: 64}}>
                <Text style={uStyles.header}>
                    {'Welcome back.'}
                </Text>

                <View style={styles.errorMessage}>
                    {errorMessage && <Text style={uStyles.message}>{errorMessage}</Text>}
                </View>
                
                <View style={styles.form}>
                    <View>
                        <Text style={uStyles.subheader}>Email</Text>
                        <TextInput 
                            style={uStyles.input} 
                            autoCapitalize='none' 
                            autoCompleteType="email"
                            autoCorrect={false}
                            onChangeText={email => setEmail(email.trim())}
                            value={email}
                        ></TextInput>
                    </View>

                    <View style={{marginTop: 16}}>
                        <Text style={uStyles.subheader}>Password</Text>
                        <TextInput 
                            style={uStyles.input} 
                            secureTextEntry 
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType="password"
                            onChangeText={password => setPassword(password.trim())}
                            value={password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={uStyles.textButton} onPress={() => handleLogin()}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white}/>
                    ) : (
                        <Text style={uStyles.subheader}>Log In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => resetPassword()}>
                    <Text style={{...uStyles.message, color: colors.light}}>
                        Reset password.
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => resendVerification()}>
                    <Text style={{...uStyles.message, color: colors.light}}>
                        Resend verification email.
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={{...uStyles.message, color: colors.light}}>
                        New around here? <Text style={uStyles.message, {color: colors.primary}}>Sign up.</Text>
                    </Text>
                </TouchableOpacity>
                <StatusBar style="light" />
            </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: "center",
        marginHorizontal: 32
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 36
    },
})