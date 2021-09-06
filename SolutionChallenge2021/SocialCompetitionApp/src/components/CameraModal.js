import React, { useEffect, useState, useRef } from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import { Camera } from 'expo-camera';
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import {ImageUpload} from '../scripts/ImageUpload'

export default CameraModal = (props) => {
    const [camType, setCamType] = useState(Camera.Constants.Type.back);
    const camRef = useRef(null);

    const flipCam = () => {
        setCamType(camType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.front);
    }

    return (
        <View style={uStyles.modal}>
            <TouchableOpacity onPress={props.close} style={{alignSelf: 'flex-end', marginRight: 12, marginTop: 12}}>
                <Feather name="x" size={32} color={colors.black}/>
            </TouchableOpacity>

            <Camera type={camType} style={uStyles.camera} ref={camRef}>
                <View style={[uStyles.roundButtonArray, {bottom: 12}]}>
                    <TouchableOpacity style={uStyles.roundButton} onPress={async () => {
                        // props.takePhoto(camRef)
                        // const uri = await ImageUpload.takePhoto(camRef);
                        try {
                            let res = await camRef.current.takePictureAsync();
                            console.log(res.uri)
                            props.takePhoto(res.uri);
                            props.close();
                        } catch (error) {
                            console.log("Error @takeImage: ", error.message);
                        }
                    }}>
                        <Feather name="camera" size={24} color={colors.white}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={uStyles.roundButton} onPress={() => flipCam()}>
                        <Feather name="repeat" size={24} color={colors.white}/>
                    </TouchableOpacity>
                </View>
            </Camera>
            
        </View>
    );
}