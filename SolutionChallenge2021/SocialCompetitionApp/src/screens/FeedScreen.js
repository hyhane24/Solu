import React, {useState, useCallback, useEffect, useRef, createRef, useContext} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList, Modal, Image, RefreshControl} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import {Feather} from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';

import {uStyles, colors} from '../styles.js'
import PostCard from '../components/PostCard'
import CommentsModal from '../components/CommentsModal.js';
import checkIfFirstLaunch from '../scripts/CheckFirstLaunch';
import ProfileModal from '../components/ProfileModal.js';
import {Firebase, FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

export default FeedScreen = () => {
    let [tempData, setTempData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [category, setCategory] = useState("For You"); 
    const [postIndex, setPostIndex] = useState();
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [onboardingVisible, setOnboardingVisible] = useState(false);
    const [recentPoints, setRecentPoints] = useState();
    const [time, setTime] = useState(0);
    const postRefs = useRef([]);
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        // get posts from backend
        getData();

        const getIsFirstLaunch = async () => {
            const isFirstLaunch = await checkIfFirstLaunch();
            setOnboardingVisible(isFirstLaunch);
        }
        getIsFirstLaunch();

        const timer = setInterval(() => {
            setTime(time => time + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time > 3) {
            setRecentPoints(undefined);
        }
    }, [time])

    const getData = async () => {
        let res = await firebase.scanUserposts();
        if (res) {
            setTempData(res);
            for (let i = 0; i < res.length; i++) {
                postRefs.current.push(null)
            }
        }

        firebase.registerForPushNotification(user.uid);

        firebase.updateActive(user.uid);
        firebase.checkActive();
    }

    const toggleLikePost = async (index) => {
        let post = tempData[index];
        post.reactions = post.reactions + 1;
        let res = await firebase.addUserpostReactionUser(post.id, user.uid); // TODO: cross check params
        let posts = tempData;
        posts[index] = post;
        setTempData(posts);
        setPoints(1, post.tag, "Awareness");
    }
    
    const renderPost = ({item, index}) => {
        return (
            <ViewShot ref={el => postRefs.current[index] = el}>
                <PostCard post={item}/>
            </ViewShot>
        )
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
      
    const refresh = async () => {
        setRefreshing(true);
        await getData();
        wait(2000).then(() => setRefreshing(false));
    }

    const setPoints = async (num, tag, category) => {
        setRecentPoints(recentPoints ? num + recentPoints : num);
        setTime(0)
        await firebase.updateAllPoints(user.uid, num, tag, category);
    }

    const onViewChange = useCallback(({ viewableItems, changed }) => {
        if (viewableItems.length > 0) {
            setPostIndex(viewableItems[0].index);
        }
    }, []);

    const toggleComments = (index) => {
        setCommentsModalVisible(!commentsModalVisible);
        if (!commentsModalVisible) {
            setPoints(2, tempData[index].tag, "Contribution");
        }
    }

    const toggleOnboarding = () => {
        setOnboardingVisible(!onboardingVisible);
    }

    const visitProfile = (index) => {
        setProfileModalVisible(!profileModalVisible);
        if (!profileModalVisible) {
            setPoints(2, tempData[index].tag, "Awareness");
        }
    }

    const sharePost = async (index) => {
        postRefs.current[index].capture().then(uri => {
            Sharing.shareAsync(uri);
        });
        setPoints(5, tempData[index].tag, "Awareness");
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={tempData.filter(item => (item.tag == category || category == "For You"))}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                onViewableItemsChanged={onViewChange}
                viewabilityConfig={{itemVisiblePercentThreshold: 50}}
                style={{flex: 1, height: "100%", paddingTop: 96}}
                contentContainerStyle={{paddingBottom: 192}}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true} // Unmount components when outside of window 
                initialNumToRender={4} // Reduce initial render amount
                maxToRenderPerBatch={2} // Reduce number in each render batch
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={refresh}
                      colors={[colors.primary]}
                      tintColor={colors.primary}
                    />
                  }
            />

            {postIndex !== undefined && tempData[postIndex] ?
                <View style={uStyles.roundButtonArray}>
                    <Text style={[uStyles.body, {color: colors.primary, textAlign: 'center'}]}>{recentPoints ? "+" + recentPoints + "!" : ""}</Text>

                    <TouchableOpacity style={uStyles.roundButton} onPress={() => toggleLikePost(postIndex)}>
                        <Feather name="heart" size={24} color={colors.white}/>
                        {/* <Text style={[uStyles.message, {fontSize: 8}]}>{postIndex !== undefined ? tempData[postIndex].reactions : "-"}</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={uStyles.roundButton} onPress={() => toggleComments(postIndex)}>
                        <Feather name="message-square" size={24} color={colors.white}/>
                        {/* <Text style={[uStyles.message, {fontSize: 8}]}>{postIndex !== undefined ? tempData[postIndex].comments.length : "-"}</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={uStyles.roundButton} onPress={() => visitProfile(postIndex)}>
                        <Feather name="user" size={24} color={colors.white}/>
                        {/* <Text style={[uStyles.message, {fontSize: 8}]}>{postIndex !== undefined ? tempData[postIndex].profileVisits : "-"}</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={uStyles.roundButton} onPress={() => sharePost(postIndex)}>
                        <Feather name="share" size={24} color={colors.white}/>
                        {/* <Text style={[uStyles.message, {fontSize: 8}]}>{postIndex !== undefined ? tempData[postIndex].shares : "-"}</Text> */}
                    </TouchableOpacity>
                </View>
            :
                <View style={{position: "absolute", top: "30%", width: "100%"}}>
                    {/* <Text style={[uStyles.header, {justifyContent: "center"}]}>Be the first to post on Solu!</Text> */}
                </View>
            }

            <View style={uStyles.topBar}>
                <Image source={require('../../assets/img/FeedLogo.png')} style={{width: 70, height: 70, marginTop: 12}}/>
                <View style={{flexDirection: "row"}}>
                    <DropDownPicker
                        items={[
                            {label: "For You", value: "For You", icon: () => <Feather name="list" size={18} color={colors.primary}/>},
                            {label: "Fitness", value: "Fitness", icon: () => <Feather name="activity" size={18} color={colors.primary}/>},
                            {label: "Environment", value: "Environment", icon: () => <Feather name="globe" size={18} color={colors.primary}/>},
                            {label: "Health", value: "Health", icon: () => <Feather name="eye" size={18} color={colors.primary}/>},
                            {label: "Justice", value: "Justice", icon: () => <Feather name="feather" size={18} color={colors.primary}/>},
                            {label: "Rights", value: "Rights", icon: () => <Feather name="star" size={18} color={colors.primary}/>},
                        ]}
                        defaultValue={category}
                        containerStyle={{height: 32, width: 160, marginTop: 32}}
                        style={{backgroundColor: colors.black, color: colors.light, borderWidth: 0, flexDirection: "row-reverse"}}
                        dropDownStyle={{backgroundColor: colors.black, borderWidth: 0, height: 512, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}
                        itemStyle={{justifyContent: "flex-start", textAlign: "right"}}
                        activeItemStyle={{backgroundColor: colors.primary, borderRadius: 10}}
                        globalTextStyle={{...uStyles.body}}
                        onChangeItem={item => setCategory(item.value)}
                        autoScrollToDefaultValue
                        searchable
                        searchablePlaceholder={"Search..."}
                        searchableStyle={{borderRadius: 20}}
                    />
                </View>
            </View>

            <Modal
                animationType="slide" 
                visible={commentsModalVisible} 
                onRequestClose={() => toggleComments()}
                transparent={true}
            >
                <CommentsModal 
                    tag={postIndex !== undefined && tempData[postIndex] ? tempData[postIndex].tag : ""} 
                    category={postIndex !== undefined && tempData[postIndex] ? tempData[postIndex].category : ""}
                    addRecentPoints={(num, tag, category) => setPoints(num, tag, category)} 
                    postId={postIndex !== undefined && tempData[postIndex] ? tempData[postIndex].id : ""} 
                    comments={postIndex !== undefined && tempData[postIndex] ? tempData[postIndex].comments : []} 
                    close={() => toggleComments()}
                />
            </Modal>

            <Modal
                animationType="slide" 
                visible={profileModalVisible} 
                onRequestClose={() => visitProfile()}
                transparent={true}
            >
                <ProfileModal 
                    user={postIndex !== undefined && tempData[postIndex] ? tempData[postIndex].userid : ""}
                    username={postIndex !== undefined && tempData[postIndex] ? tempData[postIndex].username : ""}
                    close={() => visitProfile()}
                />
            </Modal>

            <Modal
                animationType="slide" 
                visible={onboardingVisible} 
                onRequestClose={() => toggleOnboarding()}
                transparent={true}
            >
                <OnboardingModal close={() => toggleOnboarding()}/>
            </Modal>

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
