import React, {useContext, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, Platform, ActivityIndicator, KeyboardAvoidingView, Image} from 'react-native'
import {Feather} from "@expo/vector-icons";
import {StatusBar} from 'expo-status-bar';
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

import {uStyles, colors} from '../styles.js'
import {ImageUpload} from "../scripts/ImageUpload"
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext.js';

export default SignUpScreen = ({navigation}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState();
    const firebase = useContext(FirebaseContext);
    const[_, setUser] = useContext(UserContext);

    const handleSignup = async () => {
        if(name.length > 0){
            setLoading(true);
            const user = {name, email, password, profilePhoto}
    
            try {  
                const createdUser = await firebase.createUser(user);
                setUser({...createdUser, isLoggedIn: true})
                setErrorMessage("Please check for a verification email.");
            } catch (error) {
                console.log("Error @handleSignup: ", error.message);
            } finally {
                setLoading(false);
            }
        } else {
            setErrorMessage("A name is required.")
        }
    }

    const addProfilePhoto = async () => {
        const uri = await ImageUpload.addPhoto();
        if (uri) {
            setProfilePhoto(uri);
        }
    }

    return (
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
            <ImageBackground style={{width: "100%", height: "100%", borderRadius: 20}} source={require("../../assets/background.png")} imageStyle={{borderRadius: 20}}>
            <ScrollView contentContainerStyle={{paddingBottom: 64}}>
                <View style={{alignItems: "center", height: 100, width: "100%", marginTop: 64}}>
                    <Image source={require('../../assets/img/Logo.png')} style={{height: 150, width: 150}}/>
                </View>

                <View style={{alignItems: "center"}}>
                    <TouchableOpacity style={uStyles.pfpBubble} onPress={() => addProfilePhoto()}>
                        {profilePhoto ? (
                            <ImageBackground style={uStyles.pfp} source={{uri: profilePhoto}}/>
                        ) : (
                            <Feather name="plus" size={32} color={colors.black}/>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.errorMessage}>
                    {errorMessage && <Text style={{...uStyles.message, color: colors.light}}>{errorMessage}</Text>}
                </View>
                
                <View style={styles.form}>
                    <View>
                        <Text style={uStyles.subheader}>Username</Text>
                        <TextInput 
                            style={uStyles.input} 
                            autoCapitalize='none' 
                            autoCompleteType="name"
                            autoCorrect={false}
                            onChangeText={name => setName(name.trim())}
                            value={name}
                            maxLength={100}
                        ></TextInput>
                    </View>

                    <View style={{marginTop: 16}}>
                        <Text style={uStyles.subheader}>Email</Text>
                        <TextInput 
                            style={uStyles.input} 
                            autoCapitalize='none' 
                            autoCorrect={false}
                            autoCompleteType="email"
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

                <TouchableOpacity style={uStyles.textButton} onPress={() => handleSignup()}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white}/>
                    ) : (
                        <Text style={uStyles.subheader}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => navigation.navigate("LogIn")}>
                    <Text style={{...uStyles.message, color: colors.light}}>
                        Have an account? <Text style={[uStyles.message, {color: colors.primary}]}>Log In.</Text>
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
