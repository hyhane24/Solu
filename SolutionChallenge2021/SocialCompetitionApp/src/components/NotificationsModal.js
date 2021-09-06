import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, SafeAreaView, KeyboardAvoidingView} from 'react-native'
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'

export default NotificationsModal = (props) => {
    const tempData = [
        {id: "23804u2309", username: "Rohan", uid: "Notifications coming soon", text: "oierjhe", type: "default", read: true},
    ];

    const renderNotification = ({item}) => {
        return (
            <NotificationCard item={item}/>
        )
    }

    return (
        <View style={uStyles.modal}>
            <TouchableOpacity onPress={() => {
                props.close();
                // set all as read
            }} style={{alignSelf: 'flex-end', marginRight: 12, marginTop: 12}}>
                <Feather name="x" size={32} color={colors.black}/>
            </TouchableOpacity>

            <FlatList
                data={tempData.reverse()}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id.toString()}
                style={{flex: 1, height: "100%", paddingTop: 12}}
                contentContainerStyle={{paddingBottom: 96, paddingTop: 12}}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true} // Unmount components when outside of window 
                initialNumToRender={2} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
            />
        </View>
    );
}

const NotificationCard = (props) => {

    const chooseIcon = (type) => {
        let name = "";
        switch (type) {
            case "comments":
                name = "message-square";
                break;
            case "points":
                name = "trending-up";
                break;
            case "milestone":
                name = "award";
                break;
            case "post":
                name = "home"
                break;
            default:
                name = "bell"
        }
        return name;
    }

    return (
        <View style={[uStyles.commentCard, {flexDirection: "row"}]}>
            <Feather name={chooseIcon(props.item.type)} color={props.item.read ? colors.black : colors.primary} size={24}/>
            <Text style={[uStyles.body, {color: colors.black, marginLeft: 12}]}>{props.item.text}</Text>
        </View>
    );
}