import React, { useState, useContext } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, Alert} from 'react-native'
import * as WebBrowser from 'expo-web-browser';
import {Feather} from "@expo/vector-icons";
import * as Reanimatable from 'react-native-animatable';

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"

export default PostCard = (props) => {
    const firebase = useContext(FirebaseContext);

    const deletePost = async () => {
        Alert.alert(
            "Delete Post",
                "Are you sure you want to permanently delete this post?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {return;}
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                        try {
                            firebase.deleteUserpost(props.post.id);
                            props.deletePost(props.post.id);
                        } catch (error) {
                            console.log("Error @deletePost: ", error.message);
                        }
                    }
                  }
                ]
            );
    }

    return (
        <Reanimatable.View animation="slideInUp" duration={500}>
            <View style={uStyles.postCard}>
                <ImageBackground style={{width: "100%", height: "100%", borderRadius: 20}} source={props.post.userpostPhotoUrl.includes ?  {uri: props.post.userpostPhotoUrl} : props.post.imageUrl} imageStyle={{borderRadius: 20}}>
                    {props.isOwn ? <Feather name="trash-2" size={24} color={"#ff0000"} style={{position: "absolute", right: 16, top: 16}} onPress={() => deletePost()}/> : null}
                    <Caption text={props.post.caption} link={props.post.link} type={props.post.type} cause={props.post.tag}/>
                </ImageBackground>
            </View>
        </Reanimatable.View>
    );
}

const Caption = (props) => {    
    if (props.text !== undefined && props.text.length > 0) {
        return (
            <TouchableOpacity 
                style={{position: "absolute", bottom: 0, padding: 12, maxHeight: 144, backgroundColor: colors.background, width: "100%", borderRadius: 20}}
                onPress={() => {
                    if (props.link !== null && props.link.length > 0) { 
                        try {
                            WebBrowser.openBrowserAsync(props.link) 
                        } catch (error) {
                            console.log("Error opening link: ", error.message);
                        }
                    }
                }}
            >
                <Text style={[uStyles.body, {color: colors.black}]}>{props.text}</Text>
                <View style={{flexDirection: "row", marginTop: 12, alignItems: "center"}}>
                    <Tag tag={props.cause}/>
                    <Tag tag={props.type}/>
                    {(props.link !== null && props.link.length > 0) ? <Feather name="link" size={18} color={colors.dark} style={{marginHorizontal: 8}}/> : null}
                </View>
            </TouchableOpacity>
        );
    } else {
        return null;
    }
}

const Tag = (props) => {
    return (
        <View style={[uStyles.tag, {backgroundColor: colors.background}]}>
            <Text style={uStyles.message}>{props.tag}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

});