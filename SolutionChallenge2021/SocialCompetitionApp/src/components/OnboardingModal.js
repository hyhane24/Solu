import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Image} from 'react-native'
import {Feather} from "@expo/vector-icons";
import Onboarding from 'react-native-onboarding-swiper';

import {uStyles, colors} from '../styles.js'

export default OnboardingModal = (props) => {

    return (
        <Onboarding
            pages={[
                {
                    backgroundColor: colors.white,
                    image: <Image source={require('../../assets/img/Logo.png')} />,
                    title: 'Welcome to Solu',
                    subtitle: 'Making every tap count.\n\n Impact made tangible, fresh, and social.',
                },
                {
                    backgroundColor: colors.white,
                    image: <Image source={require('../../assets/img/Onboarding2.png')} />,
                    title: 'Contribute to a Cause',
                    subtitle: 'Volunteered? Have a thought? Saw something funny?\n\nMake posts about any cause you care about.',
                },
                {
                    backgroundColor: colors.white,
                    image: <Image source={require('../../assets/img/Onboarding3.png')} />,
                    title: 'Experience a Cause',
                    subtitle: 'See the impact people all over are creating in your feed.\n\n Filter by cause at the top.',
                },
                {
                    backgroundColor: colors.white,
                    image: <Image source={require('../../assets/img/Onboarding4.png')} />,
                    title: 'Join a Cause',
                    subtitle: "Find and follow new causes and top contributors.",
                },
                {
                    backgroundColor: colors.white,
                    image: <Image source={require('../../assets/img/Onboarding5.png')} />,
                    title: 'Track Your Impact',
                    subtitle: "Earn points and reach milestones for posting, commenting, sharing, and more.\n\nEven the little things matter, and we'll show you.",
                },
                {
                    backgroundColor: colors.white,
                    image: <Image source={require('../../assets/img/Onboarding6.png')} />,
                    title: 'Spread the Impact',
                    subtitle: "Share posts and your points to show off the impact one person can have in a network.",
                },
                {
                    backgroundColor: colors.white,
                    image: <Image source={require('../../assets/img/Logo.png')} />,
                    title: 'Ready?',
                    subtitle: "Time to jump into Solu.\n\n You can view this info again in your profile page.",
                },
            ]}
            titleStyles={{...uStyles.title, color: colors.primary, fontSize: 32}}
            subTitleStyles={{...uStyles.body, fontSize: 18, marginTop: 16, color: colors.dark}}
            imageContainerStyles={{paddingBottom: 0}}
            onDone={() => props.close()}
            skipToPage={6}
        />
    );
}
