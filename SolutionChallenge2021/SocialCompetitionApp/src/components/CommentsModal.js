import React, { useState, useEffect, useContext } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView, KeyboardAvoidingView, Modal} from 'react-native'
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import ProfileModal from './ProfileModal.js';
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

export default CommentsModal = (props) => {
    const [input, setInput] = useState("");
    const [comments, setComments] = useState([]);
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useContext(UserContext);

    const tempData = [
        {id: "23804u2309", username: "Rohan", uid: "owrhf", text: "I support!"},
        {id: "238e4u2309", username: "Daniel", uid: "324", text: "Nice post, shared."},
    ];

    useEffect(() => {
        // get comments from props
        getComments();
      }, []);

    const getComments = async() => {
        let comments = await firebase.scanComments();
        setComments(comments.filter(item => props.comments.includes(item.id)).reverse());
    }

    const renderComment = ({item}) => {
        return (
            <CommentCard comment={item}/>
        )
    }

    const addComment = async () => {
        if (input.length > 0) {
            props.addRecentPoints(10, props.tag, props.category);
            props.close();
            let res = await firebase.postComment(props.postId, user.uid, user.username, input);
        }
    }

    return (
        <View style={uStyles.modal}>
            <TouchableOpacity onPress={props.close} style={{alignSelf: 'flex-end', marginRight: 12, marginTop: 12}}>
                <Feather name="x" size={32} color={colors.black}/>
            </TouchableOpacity>

            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                style={{flex: 1, height: "100%", paddingTop: 12}}
                contentContainerStyle={{paddingBottom: 192, paddingTop: 192}}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true} // Unmount components when outside of window 
                initialNumToRender={2} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
                inverted
            />

            <KeyboardAvoidingView 
                behavior= {"padding"} 
            >
                <View style={{position: "relative", bottom: 160, marginHorizontal: 8, flexDirection: "row", alignItems: "center"}}>
                    <TextInput 
                            style={[uStyles.input, {width: "85%", marginRight: 8, borderBottomColor: colors.primary, backgroundColor: colors.white, color: colors.black}]} 
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType="off"
                            placeholder={"Send a message..."}
                            placeholderTextColor={colors.dark}
                            onChangeText={text => setInput(text)}
                            value={input}
                            maxLength={2000}
                    />

                    <TouchableOpacity style={uStyles.roundButton} onPress={() => addComment()}>
                        <Feather name="send" size={24} color={colors.white}/>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            
        </View>
    );
}

const CommentCard = (props) => {
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const visitProfile = () => {
        setProfileModalVisible(!profileModalVisible);
    }

    return (
        <View style={uStyles.commentCard}>
            <TouchableOpacity onPress={visitProfile}>
                <Text style={[uStyles.subheader, {color: colors.black, marginBottom: 8}]}>{props.comment.username}</Text>
            </TouchableOpacity>
            <Text style={[uStyles.body, {color: colors.black}]}>{props.comment.text}</Text>

            <Modal
                animationType="slide" 
                visible={profileModalVisible} 
                onRequestClose={() => visitProfile()}
                transparent={true}
            >
                <ProfileModal 
                    user={props.comment.uid}
                    username={props.comment.username}
                    close={() => visitProfile()}
                />
            </Modal>
        </View>
    );
}
