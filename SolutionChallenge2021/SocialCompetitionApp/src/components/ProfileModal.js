import React, { useContext, useEffect, useState } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Modal} from 'react-native';
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'
import PostCard from '../components/PostCard'


export default ProfileModal = (props) => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [userData, setUserData] = useState();
    const [posts, setPosts] = useState([]);
    const [postIndex, setPostIndex] = useState();


    useEffect(() => {
        //get user data, posts, and set it with state
        const getData = async () => {
            let newData = await firebase.getUserInfo(props.user);
            if (newData !== null) {
                setUserData(newData);
            }
            let posts = await firebase.scanUserUserposts(props.user);
            if (posts !== null) {
                setPosts(posts);
            }
        }
        getData();
    }, []);

    const tempData = [
        {id: "141415252", username: "Aritro", uid: "8301u410", imageUrl: "houar", link: "https://expo.io", caption: "uaohfauwf", type: "Volunteering", cause: "Environment", likes: 32, profileVisits: 10, shares: 2, comments: [{id: "23804u2309", username: "Rohan", uid: "owrhf", text: "oierjhe"},]},
        {id: "1414152523", username: "Hane", uid: "238823", imageUrl: "ref", link: "", caption: "fefe", type: "Volunteering", cause: "Environment", likes: 33, profileVisits: 3, shares: 12, comments: [{id: "2049230942", username: "Rohan", uid: "owrhf", text: "oierjhe"},]},
    ];

    const renderPost = ({item}) => {
        return (
            <PostCard post={item}/>
        )
    }

    const sumPoints = () => {
        let sum = 0;
        Object.values(userData.points).forEach(item => {
            sum += item.Thoughts + item.Volunteering + item.Contribution + item.Awareness + item.Activism
        })
        return sum;
    }

    return (

        // substitute the line below in place of Text...@userName after backend connected 
        // <Text style={[uStyles.toggleProfile, {marginTop: 00}]}>{user.username}</Text>

        <View style={uStyles.modal}>
            <TouchableOpacity onPress={props.close} style={{alignSelf: 'flex-end', marginRight: 12, marginTop: 12}}>
                <Feather name="x" size={32} color={colors.black}/>
            </TouchableOpacity>

            <ScrollView style={{marginTop: 30, paddingBottom: 30, overflow: "hidden",}}>

                <View style={[uStyles.pfpBubble, {alignSelf: "center", marginTop: 1}]}>
                    <ImageBackground 
                        style={uStyles.pfp}
                        source={
                            userData === undefined ? "" : (
                            userData.profilePhotoUrl === "default" ?
                            require("../../assets/defaultProfilePhoto.png")
                            : {uri: userData.profilePhotoUrl})
                        }
                    />
                </View>

                <Text style={[uStyles.header, {marginTop: 16, color: colors.black}]}>{props.username}</Text>
            
                <View style={{alignItems: "center", marginTop: 30, flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <Text style={uStyles.toggleProfile}>{userData ? userData.userposts.length : "-"}</Text>
                        <Text style={uStyles.toggleProfile}>Posts</Text>
                    </View>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <Text style={uStyles.toggleProfile}>{userData ? sumPoints() : "-"}</Text>
                        <Text style={uStyles.toggleProfile}>Points</Text>
                    </View>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <Text style={uStyles.toggleProfile}>{userData ? userData.tags.length : "-"}</Text>
                        <Text style={uStyles.toggleProfile}>Causes</Text>
                    </View>
                </View>
                <View>
                    <FlatList
                        data={posts ? posts : []}
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id.toString()}
                        style={{flex: 1, height: "100%", paddingTop: 10}}
                        contentContainerStyle={{paddingBottom: 150}}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true} 
                        initialNumToRender={4} // show 2 posts
                        maxToRenderPerBatch={2} 
                    />
                </View>
            </ScrollView>
        </View>
    );
}

