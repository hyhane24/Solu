import React, { useState, useEffect, useContext } from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Modal} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import {Feather} from "@expo/vector-icons";
import * as Reanimatable from 'react-native-animatable';

import {uStyles, colors} from '../styles.js'
import ProfileModal from '../components/ProfileModal.js';

import {FirebaseContext} from '../context/FirebaseContext.js';
import { UserContext } from '../context/UserContext'

export default ExploreScreen = () => {
    const [searchText, setSearchText] = useState("");
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [userIndex, setUserIndex] = useState(0);
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useContext(UserContext);
    const [causes, setCauses] = useState({Environment: false, Rights: false, Fitness: false, Health: false, Justice: false});
    const [users, setUsers] = useState([]);
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        // get data
        const getData = async () => {
            let info = await firebase.getUserInfo(user.uid);
            setUserInfo(info);
            let newCauses = causes;
            for (let i = 0; i < info.tags.length; i++) {
                newCauses[info.tags[i]] = true;
            }
            setCauses(newCauses);

            let gotUsers = await firebase.scanUsers();
            if (gotUsers) {
                setUsers(gotUsers.sort((a, b) => sumPoints(a.points) < sumPoints(b.points)).slice(0, 10));
            }
        }
        getData();

    }, []);

    const sumPoints = (points) => {
        let sum = 0;
        Object.values(points).forEach(item => {
            sum += item.Thoughts + item.Volunteering + item.Contribution + item.Awareness + item.Activism
        })
        return sum;
    }

    const renderCauseItem = ({item}) => {
        return (
            <SearchCard causes={causes} user={null} isCause={true} cause={item} toggleFollowing={() => toggleFollowingCause(item)} getFollowing={() => isFollowingCause(item)} visitProfile={visitProfile}/>
        );
    }

    const renderUserItem = ({item, index}) => {
        return (
            <SearchCard userInfo={userInfo} user={item} isCause={false} cause={null} toggleFollowing={() => toggleFollowingUser(item.id)} getFollowing={() => isFollowingUser(item.id)}
                visitProfile={() => {
                    setUserIndex(index);
                    visitProfile();
                }}
            />
        );
    }

    const toggleFollowingCause = async (cause) => {
        if (isFollowingCause(cause)) {
            await firebase.removeTag(user.uid, cause);
        } else {
            await firebase.addTag(user.uid, cause);
        }
        let newCauses = causes;
        newCauses[cause] = !newCauses[cause];
        setCauses(newCauses);
    }

    const toggleFollowingUser = async (otherUser) => {
        let newUserInfo = userInfo;
        if (isFollowingUser(otherUser)) {
            await firebase.removeFriend(user.uid, otherUser);
            newUserInfo.friends = newUserInfo.friends.filter(item => item !== otherUser);
        } else {
            await firebase.addFriend(user.uid, otherUser);
            newUserInfo.friends.push(otherUser);
        }
        setUserInfo(newUserInfo);
    }

    const isFollowingCause = (cause) => {
        if (causes[cause]) {
            return true;
        } else {
            return false;
        }
    }

    const isFollowingUser = (otherUser) => {
        if (userInfo.friends.includes(otherUser.id) || userInfo.friends.includes(otherUser)) {
            return true;
        } else {
            return false;
        }
    }

    const visitProfile = () => {
        setProfileModalVisible(!profileModalVisible);
    }

    const tempUserData = [
        {username: "Aritro", uid: "8301u410", pfpUrl: "default", causes: ["Environment"], points: 32},
        {username: "Hane", uid: "238823", pfpUrl: "default", causes: ["Environment"], points: 33},
    ];

    const tempCausesData = [
        "Environment",
        "Fitness",
        "Rights",
        "Health",
        "Justice"
    ]

    const SearchCard = (props) => {
        let icon = ""
        if (props.isCause) {
            switch (props.cause) {
                case "Environment":
                    icon = "globe";
                    break;
                case "Fitness":
                    icon = "activity";
                    break;
                case "Justice":
                    icon = "feather";
                    break;
                case "Rights":
                    icon = "star";
                    break;
                case "Health":
                    icon = "eye";
                    break;
                default:
                    icon = "list";
            }
        }
        const [heartColor, setHeartColor] = useState((props.isCause ? isFollowingCause(props.cause): isFollowingUser(props.user))? colors.primary : colors.dark);
        return (
            <View style={[uStyles.commentCard, {flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: colors.background, alignSelf: "center", marginTop: 4}]}>
                {props.isCause ? 
                    <Feather name={icon} size={24} color={colors.primary} style={{marginTop: 0, marginRight: 8}}/>
                :
                    <View style={[uStyles.pfpBubble, {width: 32, height: 32, marginTop: 0, marginRight: 8, shadowColor: colors.primary}]}>
                        <ImageBackground 
                            style={[uStyles.pfp, {width: 32, height: 32}]}
                            source={
                                props.user.profilePhotoUrl === "default" ?
                                require("../../assets/defaultProfilePhoto.png")
                                : {uri: props.user.profilePhotoUrl}
                            }
                        />
                    </View>
                }
    
                <TouchableOpacity onPress={() => {if (!props.isCause) { props.visitProfile(); }}}>
                    <Text style={[uStyles.body, {color: colors.black}]}>{props.isCause ? props.cause : props.user.username}</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={{position: "absolute", right: 12}} onPress={() => {
                    props.toggleFollowing();
                    setHeartColor(heartColor === colors.primary ? colors.dark : colors.primary);
                }}>
                    <Feather name="heart" size={24} color={heartColor}/>
                </TouchableOpacity>
            </View>
    
        );
    }

    return (
        <View style={styles.container}>
            
            {/* <TextInput 
                style={[uStyles.input, {width: "85%", marginTop: 96, alignSelf: "center",}]} 
                placeholder={"Search..."}
                placeholderTextColor={colors.light}
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                maxLength={2000}
            /> */}

            <Reanimatable.View animation="slideInUp" duration={500} style={{marginTop: 108}}>
                <View style={uStyles.searchCard}>
                    <Text style={[uStyles.header, {marginTop: 4, color: colors.black, paddingBottom: 8}]}>Causes</Text>
                    <Text style={[uStyles.message, {marginTop: 0, color: colors.black, paddingBottom: 8, textAlign: "center"}]}>Tap the causes you want to follow</Text>

                    <FlatList
                        data={Object.keys(causes)}
                        renderItem={renderCauseItem}
                        keyExtractor={(item) => item}
                        style={{flex: 1, height: "100%", paddingTop: 32}}
                        contentContainerStyle={{paddingBottom: 12}}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={2} // Reduce initial render amount
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                    />
                </View>

                <View style={uStyles.searchCard}>
                    <Text style={[uStyles.header, {marginTop: 4, color: colors.black, paddingBottom: 8}]}>Top Contributors</Text>
                    <Text style={[uStyles.message, {marginTop: 0, color: colors.black, paddingBottom: 8, textAlign: "center"}]}>Tap the people you want to follow</Text>

                    <FlatList
                        data={users}
                        renderItem={renderUserItem}
                        keyExtractor={(item) => item.id.toString()}
                        style={{flex: 1, height: "100%", paddingTop: 32}}
                        contentContainerStyle={{paddingBottom: 12}}
                        showsVerticalScrollIndicator={false}
                        // removeClippedSubviews={true} // Unmount components when outside of window 
                        // initialNumToRender={2} // Reduce initial render amount
                        // maxToRenderPerBatch={1} // Reduce number in each render batch
                    />
                </View>
            </Reanimatable.View>

            <Modal
                animationType="slide" 
                visible={profileModalVisible} 
                onRequestClose={() => visitProfile()}
                transparent={true}
            >
                <ProfileModal 
                    user={userIndex !== undefined && users[userIndex] !== undefined ? users[userIndex].id : ""}
                    username={userIndex !== undefined && users[userIndex] !== undefined ? users[userIndex].username : ""}
                    close={() => visitProfile()}
                />
            </Modal>

            <View style={uStyles.topBar}>
                <Text style={[uStyles.title, {color: colors.primary, textAlign: 'left', marginTop: 32}]}>Explore</Text>
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