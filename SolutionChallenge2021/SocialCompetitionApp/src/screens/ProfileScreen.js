import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Modal} from 'react-native'
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'
import PostCard from '../components/PostCard'
import {ImageUpload} from '../scripts/ImageUpload'
import OnboardingModal from '../components/OnboardingModal.js';
import NotificationsModal from '../components/NotificationsModal'
import SettingsModal from '../components/SettingsModal.js';

export default ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [userData, setUserData] = useState();
    const [posts, setPosts] = useState([]);
    const [onboardingVisible, setOnboardingVisible] = useState(false);
    const [settingsVisible, setSettingsVisiible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);

    useEffect(() => {
        //get user data, posts, and set it with state
        const getData = async () => {
            let newData = await firebase.getUserInfo(user.uid);
            if (newData !== null) {
                setUserData(newData);
            }
            let posts = await firebase.scanUserUserposts(user.uid);
            if (posts !== null) {
                console.log(posts);
                setPosts(posts);
            }
        }
        getData();
    }, []);

    const tempData = [
        {id: "141415252", username: "Rohan", uid: "238824", pfpUrl: "default", imageUrl: require("../../assets/img/Feed1.png"), link: "https://expo.io", caption: "Yellow Jackets, vote!", type: "Contribution", cause: "Avtivism", likes: 32, profileVisits: 10, shares: 2, comments: [{id: "23804u2309", username: "Rohan", uid: "owrhf", text: "I voted!"},]},
        {id: "1414152524", username: "Rohan", uid: "238824", pfpUrl: "default", imageUrl: require("../../assets/img/Feed3.png"), link: "", caption: "BLM", type: "Activism", cause: "Awareness", likes: 20, profileVisits: 3, shares: 12, comments: [{id: "2049230943", username: "Hane", uid: "owrh", text: "Black Lives Matter!"},]},
        {id: "1414152525", username: "Rohan", uid: "238824", pfpUrl: "default", imageUrl: require("../../assets/img/Feed4.png"), link: "", caption: "Save the planet", type: "Awareness", cause: "Thoughts", likes: 10, profileVisits: 3, shares: 12, comments: [{id: "2049230944", username: "Aritro", uid: "owrhello", text: "Stay green, go green"},]},
    ];

    const toggleOnboarding = () => {
        setOnboardingVisible(!onboardingVisible);
    }

    const toggleNotifications = () => {
        setNotificationsVisible(!notificationsVisible);
    }

    const toggleSettings = () => {
        setSettingsVisiible(!settingsVisible);
    }

    const renderPost = ({item}) => {
        return (
            <PostCard post={item} isOwn deletePost={id => deletePost(id)}/>
        )
    }

    const deletePost = (id) => {
        let newPosts = posts;
        newPosts.filter(item => item.id !== id);
        setPosts(newPosts);
    }

    const addPostPhoto = async () => {
        const uri = await ImageUpload.addPhoto();
        if (uri) {
            let url = await firebase.uploadProfilePhoto(uri);
            setUser({...user, profilePhotoUrl: url});
        }
    }

    const sumPoints = () => {
        let sum = 0;
        Object.values(userData.points).forEach(item => {
            console.log(item)
            sum += item.Thoughts + item.Volunteering + item.Contribution + item.Awareness + item.Activism
        })
        return sum;
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 64}}>
                <TouchableOpacity style={[uStyles.pfpBubble, {alignSelf: "center"}]} onPress={() => addPostPhoto()}>
                    <ImageBackground 
                        style={uStyles.pfp}
                        source={
                            user.profilePhotoUrl === "default" ?
                            require("../../assets/defaultProfilePhoto.png")
                            : {uri: user.profilePhotoUrl}
                        }
                    />
                </TouchableOpacity>
                <Text style={[uStyles.header, {marginTop: 16, color: colors.black}]}>{user.username}</Text>

                <View style={{alignItems: "center", marginTop: 16, flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <Text style={{...uStyles.subheader, color: colors.black}}>{userData ? userData.userposts.length : "-"}</Text>
                        <Text style={{...uStyles.body, color: colors.black}}>Posts</Text>
                    </View>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <Text style={{...uStyles.subheader, color: colors.black}}>{userData ? sumPoints() : "-"}</Text>
                        <Text style={{...uStyles.body, color: colors.black}}>Points</Text>
                    </View>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <Text style={{...uStyles.subheader, color: colors.black}}>{userData ? userData.tags.length : "-"}</Text>
                        <Text style={{...uStyles.body, color: colors.black}}>Causes</Text>
                    </View>
                </View>

                <View>
                    <FlatList
                        data={posts ? posts : []}
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id.toString()}
                        style={{flex: 1, height: "100%", paddingTop: 32}}
                        contentContainerStyle={{paddingBottom: 192}}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={4} // Reduce initial render amount
                        maxToRenderPerBatch={2} // Reduce number in each render batch
                    />
                </View>
            </ScrollView>

            <Modal
                animationType="slide" 
                visible={onboardingVisible} 
                onRequestClose={() => toggleOnboarding()}
                transparent={true}
            >
                <OnboardingModal close={() => toggleOnboarding()}/>
            </Modal>

            <Modal
                animationType="slide" 
                visible={notificationsVisible} 
                onRequestClose={() => toggleNotifications()}
                transparent={true}
            >
                <NotificationsModal close={() => toggleNotifications()}/>
            </Modal>

            <Modal
                animationType="slide" 
                visible={settingsVisible} 
                onRequestClose={() => toggleSettings()}
                transparent={true}
            >
                <SettingsModal close={() => toggleSettings()}/>
            </Modal>

            <View style={uStyles.topBar}>
                <Text style={[uStyles.title, {color: colors.primary, textAlign: 'left', marginTop: 32}]}>Profile</Text>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={{alignItems: "right", marginTop: 32}} onPress={() => toggleOnboarding()}>
                        <Feather name="help-circle" size={24} color={colors.white}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: "right", marginTop: 32, marginLeft: 16}} onPress={() => toggleSettings()}>
                        <Feather name="settings" size={24} color={colors.white}/>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={{alignItems: "right", marginTop: 32, marginLeft: 16}} onPress={() => toggleNotifications()}>
                        <Feather name="bell" size={24} color={unreadNotifications ? colors.primary : colors.white}/>
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
    },
});