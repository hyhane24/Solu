import React, {useRef, useState, useEffect, useContext} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Image} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import * as Sharing from 'expo-sharing';
import {Feather} from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import { StackedBarChart, ProgressCircle, YAxis, XAxis } from 'react-native-svg-charts'
import * as Reanimatable from 'react-native-animatable';

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

export default GameScreen = () => {
    const view = useRef();
    const [impactFacts, setImpactFacts] = useState([]);
    const [points, setPoints] = useState([]);
    const [milestones, setMilestones] = useState([{}, {}]);
    const [challenge, setChallenge] = useState({})
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useContext(UserContext);
    const [types, setTypes] = useState(["Environment", "Fitness", "Health", "Justice", "Rights"]);
    const allTypes = ["Environment", "Fitness", "Health", "Justice", "Rights"];
    const categories = ["Thoughts", "Awareness", "Contribution", "Activism", "Volunteering"];

    useEffect(() => {
        getProgress(); // gets milestones, challenges, and points
        getFacts();
    }, []);

    const getFacts = async () => {
        let res = await firebase.getUpcomingFacts(user.uid);
        setImpactFacts(res.slice(Math.max(res.length - 10, 0)).reverse());
    }

    const getProgress = async () => {
        let res = await firebase.getUserInfo(user.uid);
        setPoints(Object.values(res.points));
        setTypes(Object.keys(res.points));
        let newMilestones = genIndividualMilestones(res.points);
        let challenge = await firebase.getCurrentChallenge();
        if (challenge === undefined) {
            await firebase.postChallenge("Environment", "Volunteering", "Reach 3000 points in Environment through Volunteering.", 3000);
            challenge = await firebase.getCurrentChallenge();
        }
        await firebase.updateChallengeProgress(user.uid, 0, challenge.tag, challenge.category);
        challenge = await firebase.getCurrentChallenge();
        setChallenge(challenge);

        if (res.milestones === null || res.milestones.length === 0) {
            let post1 = newMilestones[0];
            let post2 = newMilestones[1];
            await firebase.postMilestone(post1.uid, post1.tag, post1.category, post1.text, post1.progress, post1.goal);
            await firebase.postMilestone(post2.uid, post2.tag, post2.category, post2.text, post2.progress, post2.goal);
        }  else if (res.milestones.length === 1) {
            let post1 = newMilestones[Math.floor(Math.random() * newMilestones.length)];
            await firebase.postMilestone(post1.uid, post1.tag, post1.category, post1.text, post1.progress, post1.goal);
        }

        let newRes = await firebase.getUserInfo(user.uid);
        const milestone1 = await firebase.getMilestone(newRes.milestones[0]);
        const milestone2 = await firebase.getMilestone(newRes.milestones[1]);
        setMilestones([milestone1, milestone2]);
    }

    const genIndividualMilestones = (pointsMap) => {
        let maxIndex = 0;
        let maxSum = 0;
        let minIndex = 0;
        let minSum = 0;
        let arr = Object.values(pointsMap);
        arr.forEach((item, index) => {
            let sum = item.Thoughts + item.Volunteering + item.Activism + item.Contribution + item.Awareness;
            if (sum > maxSum) {
                maxIndex = index;
                maxSum = sum;
            } else if (sum < minSum) {
                minIndex = index;
                minSum = sum;
            }
        });
        let missingTags = allTypes.filter(tag => !Object.keys(arr).includes(tag));
        let maxTag = missingTags.length === allTypes.length ? missingTags[Math.floor(Math.random() * missingTags.length)] : types[maxIndex];
        let minTag = missingTags.length > 0 ? missingTags[Math.floor(Math.random() * missingTags.length)] : types[minIndex];
        const maxCategory = () => {
            if (missingTags.length === allTypes.length) {
                return categories[Math.floor(Math.random() * categories.length)];
            }
            let maxNum = arr[maxIndex]["Thoughts"];
            let maxCat = "Thoughts"
            Object.entries(arr[maxIndex]).forEach((key, val) => {
                if (val > maxNum) {
                    maxNum = val;
                    maxCat = key[0];
                }
            })
            return maxCat;
        }
        const minCategory = () => {
            if (missingTags.length > 0) {
                return categories[Math.floor(Math.random() * categories.length)];
            }
            let minNum = arr[minIndex]["Thoughts"];
            let minCat = "Thoughts"
            Object.entries(arr[minIndex]).forEach((key, val) => {
                if (val < minNum) {
                    minNum = val;
                    minCat = key[0];
                }
            })
            return minCat;
        }
        return ([
            {uid: user.uid, tag: types[maxIndex], goal: Math.ceil((maxSum + 1) / 100) * 120, text: "Reach " + Math.ceil((maxSum + 1) / 100) * 120 + " points in " + maxTag + " through " + maxCategory() + ".", category: maxCategory(), progress: maxSum},
            {uid: user.uid, tag: types[minIndex], goal: Math.ceil((minSum + 1) / 100) * 120, text: "Reach " + Math.ceil((minSum + 1) / 100) * 120 + " points in " + minTag + " through " + minCategory() + ".", category: minCategory(), progress: minSum}
        ]);
    }

    const sharePost = async () => {
        view.current.capture().then(uri => {
            Sharing.shareAsync(uri);
        });
    }

    const getMaxSum = () => {
        let sum = 0;
        Object.values(points).forEach(item => {
            let newSum = item.Thoughts + item.Volunteering + item.Contribution + item.Awareness + item.Activism;
            if (newSum > sum) {
                sum = newSum
            }
        })
        return sum;
    }

    const renderCauseItem = ({item, index}) => {
        let sum = item.Thoughts + item.Volunteering + item.Activism + item.Contribution + item.Awareness;
        let url = "";
        if (sum > 10000) {
            url = require('../../assets/img/AwardGold.png')
        } else if (sum > 1000) {
            url = require('../../assets/img/AwardSilver.png')
        } else {
            url = require('../../assets/img/AwardBronze.png')
        }
        return (
            <View style={[uStyles.commentCard, {flexDirection: "row", alignItems: "center", backgroundColor: colors.background, marginTop: 4, height: 48}]}>
                <Image source={url} />
                <Text style={[uStyles.body, {color: colors.black}]}>{types[index]}</Text>
            </View>
        );
    }

    const sumPoints = () => {
        let sum = 0;
        Object.values(points).forEach(item => {
            sum += item.Thoughts + item.Volunteering + item.Contribution + item.Awareness + item.Activism
        })
        return sum;
    }

    return (
        <View style={styles.container}>
            <ViewShot ref={view} style={{height: "100%"}}>
                <ScrollView style={{marginTop: 98}} contentContainerStyle={{paddingBottom: 96}}>
                    <Reanimatable.View animation="slideInUp" duration={500}>
                        <View style={[uStyles.searchCard, {height: 400}]}>
                            <Text style={[uStyles.header, {marginTop: 4, color: colors.black, paddingBottom: 8}]}>Points</Text>

                            <View style={{flexDirection: "row", marginBottom: 8}}>
                                <FlatList
                                    data={types}
                                    scrollEnabled={false}
                                    renderItem={({item}) => {
                                        return (
                                            <Text style={[uStyles.message, {color: colors.dark, fontSize: 8}]}>{item}</Text>
                                        );
                                    }}
                                    keyExtractor={(item) => item.toString()}
                                    style={{flex: 1, height: 200}}
                                    contentContainerStyle={{flex: 1, justifyContent: "space-evenly"}}
                                    showsVerticalScrollIndicator={false}
                                />    
                                <StackedBarChart
                                    style={{height: 200, width: "90%"}}
                                    keys={["Thoughts", "Volunteering", "Contribution", "Awareness", "Activism"]} 
                                    colors={[colors.dark, colors.primary, colors.light, colors.black, colors.primary]}
                                    data={points}
                                    showGrid={false}
                                    contentInset={{ top: 8, bottom: 8 }}
                                    horizontal={true}
                                />
                            </View>
                            <XAxis
                                style={{ marginHorizontal: 10, width: "90%" }}
                                data={[0, 1, 2, 3, 4]}
                                formatLabel={(a, index) => Math.round((index * getMaxSum() / 5))}
                                contentInset={{ left: 32, right: 16 }}
                                svg={{ fontSize: 10, fill: colors.black }}
                            />                    
                            <Text style={[uStyles.body, {alignSelf: "center", color: colors.black, marginTop: 16}]}>
                                You earned {sumPoints()} points total!
                            </Text>
                            
                            <FlatList
                                data={points}
                                renderItem={renderCauseItem}
                                keyExtractor={(item) => item.toString()}
                                style={{flex: 1, height: "100%", paddingTop: 32}}
                                contentContainerStyle={{paddingBottom: 12}}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                removeClippedSubviews={true} // Unmount components when outside of window 
                                initialNumToRender={2} // Reduce initial render amount
                                maxToRenderPerBatch={1} // Reduce number in each render batch
                            />
                        </View>
                    </Reanimatable.View>

                    <Reanimatable.View animation="slideInUp" duration={500}>
                        <View style={[uStyles.searchCard, {height: 340}]} animation="slideInUp" duration={500}>
                            <Text style={[uStyles.header, {marginTop: 4, color: colors.black, paddingBottom: 8}]}>Impact Facts</Text>
                            
                            <FlatList
                                data={impactFacts}
                                renderItem={(item) => {
                                    console.log(item.item.timestamp)
                                    var time = new Date(item.item.timestamp);
                                    var day = time.getDate();
                                    var month = time.getMonth() + 1;
                                    var timeStr = month + "/" + day;
                                    return (
                                        <Text style={[uStyles.body, {color: colors.black, padding: 12}]}>{timeStr + " - " + item.item.fact}</Text>
                                    )
                                }}
                                keyExtractor={(item) => item.fact.toString()}
                                style={{flex: 1, height: "100%", paddingTop: 32}}
                                contentContainerStyle={{paddingBottom: 12}}
                            />
                        </View>
                    </Reanimatable.View>
                    
                    <View style={[uStyles.searchCard, {height: 680}]}>
                        <Text style={[uStyles.header, {marginTop: 4, color: colors.black, paddingBottom: 8}]}>Milestones</Text>

                        <View>
                            <ProgressCircle style={{ height: 250, marginTop: 12}} progress={challenge !== null && challenge !== undefined && challenge.progress !== undefined ? challenge.progress[user.uid] : 1} progressColor={colors.primary}/>
                            <Text style={[uStyles.body,{color: colors.black, position: "absolute", top: "45%", alignSelf: "center", textAlign: "center", width: 250, textAlignVertical: "center"}]}>{challenge !== null && challenge !== undefined ? challenge.text : ""}</Text>
                        </View>
                        <View>
                            <ProgressCircle style={{ height: 150, marginTop: 16}} progress={milestones[0] ? (milestones[0].progress / milestones[0].goal) : 1} progressColor={colors.primary}/>
                            <Text style={[uStyles.body,{color: colors.black, position: "absolute", top: "40%", alignSelf: "center", textAlign: "center", width: 150, textAlignVertical: "center"}]}>{milestones[0] ? milestones[0].text : ""}</Text>
                        </View>
                        <View>
                            <ProgressCircle style={{ height: 150, marginTop: 16}} progress={milestones[1] ? (milestones[1].progress / milestones[1].goal) : 1} progressColor={colors.primary}/>
                            <Text style={[uStyles.body,{color: colors.black, position: "absolute", top: "40%", alignSelf: "center", textAlign: "center", width: 150}]}>{milestones[1] ? milestones[1].text : ""}</Text>
                        </View>
                        
                        {/* <Text style={[uStyles.body,{color: colors.black, alignSelf: "center", marginTop: 32}]}>Last completed milestone 4!</Text>
                        <Text style={[uStyles.body, {alignSelf: "center", color: colors.black, marginTop: 16}]}>32 milestones already reached!</Text> */}
                    </View>
                </ScrollView>
            </ViewShot>

            <View style={uStyles.roundButtonArray}>
                <TouchableOpacity style={uStyles.roundButton} onPress={() => sharePost()}>
                    <Feather name="share" size={24} color={colors.white}/>
                </TouchableOpacity>
            </View>

            <View style={uStyles.topBar}>
                <Text style={[uStyles.title, {color: colors.primary, textAlign: 'left', marginTop: 32}]}>Impact</Text>
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
