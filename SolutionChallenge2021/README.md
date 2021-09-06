# Solution Challenge 2021
## How to Run

_Note: Though this app was built to function on both iOS and Android, it was primarly designed for iOS considering our userbase. For the best possible user experience, please use the iOS version. The Android version will be caught up soon._

**Android:**
_Note: iOS instructions below should also work on Android, but this is another way._
1. Install Expo Go from the Play Store.
2. Visit this link on your phone to open the app: https://expo.io/@winky334/projects/Solu

**iOS:**
Make sure you have React Native 0.63 and Expo 4.1.6 installed (other versions may work but are untested).
 1. Clone this repository
 2. Navigate to the directory `cd SocialCompetitionApp`
 3. While in the same directory, run `yarn add @react-native-community/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/stack expo-camera expo-image-picker expo-notifications expo-sharing expo-status-bar expo-web-browser firebase@7.9.0 lottie-react-native react-native-animatable react-native-dropdown-picker react-native-gesture-handler react-native-onboarding-swiper react-native-screens react-native-svg react-native-svg-charts react-native-view-shot@3.1.2` (if you get a _Module Not Resolved_ error, yarn add the missing package)
 4. Run `expo start`

## What It Does
This app keeps grassroots activism fresh and social, addressing UN SDG 10. The UN and many others have made the importance of grassroots movements clear. Social media has the power to organize these movements around the world's biggest problems, yet they rise and fall within weeks; nothing truly ends up changing. Even motivated users simply forget about what's important to them. Why? For one, other content drowns it out. Secondly, if something stays the same for too long on the internet, it is forgotten; the biggest problems in the world can't be solved instantly, and small steps forward don't get attention in the mess of current social media.

So that's what we tackled:

**We streamline the content:** communities are organized around different good causes, featuring a post format that puts visual content, captions, links, and sharing front and center to make connecting with causes natural. At the request of our users, they can choose to be anonymous or not, so they are free to express their opinions and have thoughtful discussions.

**We quantify and visualize every action:** users can track their own impact through a gamification system with points, auto-generated milestones to encourage each individual, and highlighting the impact of recent actions in plain English. The most impactful users are featured to the community. We let people share both their own progress and others' posts in a highly visual format, so our community's reach is not isolated.

Our social app helps users focus on smaller goals and activity within the larger issues they care about. **We make it clear that every step counts.** This is a platform that creates impactful grassroots communities that don't fizzle out for no good reason.

## Development
We built the frontend in React Native with JavaScript since we all knew JavaScript. This allowed us to focus our efforts on creating the experience users want, including a robust backend system built in Google Firebase, with authentication, Firestore, Authentication, and Cloud Functions. We also utilized Google Cloud Vision API for intelligent content moderation. 

We conducted weekly user testing with interested college students that included the following: idea selection, design, UI, desired settings and privacy, most valuable and interesting content to view and post, effectiveness of the gamification system, and full app experience.

## About the Project
This project is for the 2021 Google Solution Challenge, by Team Salsa from the DSC at the Georgia Institute of Technology. The team is: Rohan Agarwal (project lead), Hane Yie, Daniel Yuan, Aritro Basu.

The name Solu is short for _Socialis Ludum_, Latin for "social game," signifying the two core principles we use to motivate individuals to do social good.

Find a video summary [here](https://www.youtube.com/watch?v=JhWZspMDih0).
