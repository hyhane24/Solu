import React, { useEffect, useState, useContext } from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Modal, Alert, KeyboardAvoidingView, ScrollView} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import {Feather} from "@expo/vector-icons";
import DropDownPicker from 'react-native-dropdown-picker';

import {uStyles, colors} from '../styles.js'
import {ImageUpload} from '../scripts/ImageUpload'
import PostCard from "../components/PostCard"
import CameraModal from '../components/CameraModal.js';

import {FirebaseContext} from '../context/FirebaseContext.js';
import { UserContext } from '../context/UserContext'

export default PostScreen = () => {
    const [post, setPost] = useState({id: "", username: "", uid: "", userpostPhotoUrl: "", link: "", caption: "", category: "", tag: "", reactions: 0, profileVisits: 0, shares: 0, comments: []});
    const [camVisible, setCamVisible] = useState(false);
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useContext(UserContext);

    const sendPost = () => {
        if (post.userpostPhotoUrl.length > 0 && post.tag.length > 0 && post.category.length > 0) {
            Alert.alert(
            "Make a post",
                "Are you sure you want to post this?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {
                        return;
                    }
                  },
                  {
                    text: "OK",
                    onPress: async () => {
                        let toPost = {...post};
                        toPost.caption = toPost.caption.trim();
                        if (toPost.caption.length === 0) {
                            toPost.link = "";
                        }
                        toPost.uid = user.uid;
                        toPost.username = user.username;
                        await firebase.postUserpost(toPost);
                        await firebase.updateAllPoints(user.uid, 10, toPost.tag, toPost.category);
                        setPost({id: "", username: "", uid: "", userpostPhotoUrl: "", link: "", caption: "", category: "", tag: "", reactions: 0, profileVisits: 0, shares: 0, comments: []});
                    }
                  }
                ]
            );
        } else {
            Alert.alert("You need an image and a tag!")
        }
    }

    const addPostPhoto = async () => {
        const uri = await ImageUpload.addPhoto();
        if (uri) {
            let newPost = {...post};
            newPost.userpostPhotoUrl = uri;
            setPost(newPost);
        }
    }

    const takePostPhoto = async (uri) => {
        // console.log(camera)
        // const uri = await ImageUpload.takePhoto(camera);
        if (uri) {
            let newPost = {...post};
            newPost.userpostPhotoUrl = uri;
            setPost(newPost);
        }
    }

    const linkInput = () => {
        if (post.caption.length > 0) {
            Alert.prompt(
                "Enter link",
                "Enter a link you want your post to lead to.",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "OK",
                    onPress: text => {
                        let newPost = {...post};
                        if (!text.substring(0, 7).includes("http://") && !text.substring(0, 8).includes("https://")) {
                            text = "https://" + text;
                        }
                        newPost.link = text;
                        setPost(newPost);
                    }
                  },
                  {
                    text: 'Clear',
                    onPress: () => {
                        let newPost = {...post};
                        newPost.link = "";
                        setPost(newPost);
                    }
                  },
                ],
              );
        } else {
            Alert.alert(
                "Enter link",
                "You need a caption before you can add a link.",
                [
                  {
                    text: "OK",
                    style: "OK"
                  },
                ],
              );
        }
    }

    const toggleCamModal = () => {
        setCamVisible(!camVisible);
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={"padding"}>
                <ScrollView style={{marginTop: 96, paddingBottom: 96, overflow: "hidden",}}>
                    <PostCard post={post}/>

                    <TextInput 
                        style={[uStyles.input, {width: "85%", marginTop: 12, alignSelf: "center", backgroundColor: colors.light, color: colors.black, borderBottomColor: colors.dark}]} 
                        placeholder={"Add a caption..."}
                        placeholderTextColor={colors.light}
                        onChangeText={text => {
                            let newPost = {...post};
                            newPost.caption = text;
                            setPost(newPost);
                        }}
                        value={post.caption}
                        maxLength={2000}
                    />

                    <View style={{flexDirection: "row", marginTop: 12, alignItems: "center", justifyContent: "center"}}>
                        <Feather name="link" size={18} color={colors.light} style={{marginHorizontal: 8, alignSelf: "center"}}/>
                        <Text style={uStyles.message}>{post.link}</Text>
                    </View>

                    <View style={{marginBottom: 256, alignItems: "center", flexDirection: "row", justifyContent: "space-evenly"}}>
                        <DropDownPicker
                           items={[
                                {label: "Fitness", value: "Fitness", icon: () => <Feather name="activity" size={18} color={colors.primary}/>},
                                {label: "Environment", value: "Environment", icon: () => <Feather name="globe" size={18} color={colors.primary}/>},
                                {label: "Health", value: "Health", icon: () => <Feather name="eye" size={18} color={colors.primary}/>},
                                {label: "Justice", value: "Justice", icon: () => <Feather name="feather" size={18} color={colors.primary}/>},
                                {label: "Rights", value: "Rights", icon: () => <Feather name="star" size={18} color={colors.primary}/>},
                            ]}
                            containerStyle={{height: 32, width: 160, marginTop: 12}}
                            style={{backgroundColor: colors.background, borderWidth: 0, flexDirection: "row-reverse", borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}
                            dropDownStyle={{backgroundColor: colors.background, borderWidth: 0, height: 512, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}
                            itemStyle={{justifyContent: "flex-start", textAlign: "right"}}
                            activeItemStyle={{backgroundColor: colors.primary, borderRadius: 10}}
                            globalTextStyle={[uStyles.body, {color: colors.dark}]}
                            onChangeItem={item => {
                                let newPost = {...post};
                                newPost.tag = item.label;
                                setPost(newPost);
                            }}
                            autoScrollToDefaultValue
                            searchable
                            searchablePlaceholder={"Search..."}
                            searchableStyle={{borderRadius: 20}}
                        />

                        <DropDownPicker
                            items={[
                                {label: "Thoughts", value: "Thoughts", icon: () => <Feather name="book-open" size={18} color={colors.primary}/>},
                                {label: "Awareness", value: "Awareness", icon: () => <Feather name="cast" size={18} color={colors.primary}/>},
                                {label: "Activism", value: "Activism", icon: () => <Feather name="flag" size={18} color={colors.primary}/>},
                                {label: "Contribution", value: "Contribution", icon: () => <Feather name="gift" size={18} color={colors.primary}/>},
                                {label: "Volunteering", value: "Volunteering", icon: () => <Feather name="heart" size={18} color={colors.primary}/>},
                            ]}
                            containerStyle={{height: 32, width: 160, marginTop: 12}}
                            style={{backgroundColor: colors.background, borderWidth: 0, flexDirection: "row-reverse", borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}
                            dropDownStyle={{backgroundColor: colors.background, borderWidth: 0, height: 512, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}
                            itemStyle={{justifyContent: "flex-start", textAlign: "right"}}
                            activeItemStyle={{backgroundColor: colors.primary, borderRadius: 10}}
                            globalTextStyle={[uStyles.body, {color: colors.dark}]}
                            onChangeItem={item => {
                                let newPost = {...post};
                                newPost.category = item.label;
                                setPost(newPost);
                            }}
                            autoScrollToDefaultValue
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <View style={uStyles.roundButtonArray}>
                <TouchableOpacity style={uStyles.roundButton} onPress={() => toggleCamModal()}>
                    <Feather name="camera" size={24} color={colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity style={uStyles.roundButton} onPress={() => addPostPhoto()}>
                    <Feather name="image" size={24} color={colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity style={uStyles.roundButton} onPress={() => linkInput()}>
                    <Feather name="link" size={24} color={post.link.length > 0 ? colors.primary : colors.white}/>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide" 
                visible={camVisible} 
                onRequestClose={() => toggleCamModal()}
                transparent={true}
            >
                <CameraModal close={() => toggleCamModal()} takePhoto={(uri) => takePostPhoto(uri)}/>
            </Modal>

            <View style={uStyles.topBar}>
                <Text style={[uStyles.title, {color: colors.primary, textAlign: 'left', marginTop: 32}]}>Contribute</Text>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={{alignItems: "right", marginTop: 32, marginLeft: 16}} onPress={() => sendPost()}>
                            <Feather name="send" size={24} color={colors.white}/>
                    </TouchableOpacity>
                </View>
            </View>

            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
    },
});