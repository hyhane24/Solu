import React, { createContext } from "react";
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

import config from "../config/firebase";
import { ImageUpload } from "../scripts/ImageUpload";

const FirebaseContext = createContext();

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();
const functions = firebase.functions();
// TODO: define functions
// e.g. var addMessage = firebase.functions().httpsCallable('addMessage');

const Firebase = {
  // cloud functions
  getChallenge: async (challenge) => {
    // scuffed
    try {
      let challengeRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/challenges-get/" +
          challenge
      );
      return challengeRaw.json();
    } catch (error) {
      console.log("Error @getChallenge: ", error.message);
    }
  },
  getCurrentChallenge: async () => {
    try {
      let challengeRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/challenges-get-current/"
      );
      return challengeRaw.json();
    } catch (error) {
      console.log("Error @getCurrentChallenge: ", error.message);
    }
  },
  postChallenge: async (tag, category, text, goal) => {
    try {
      let challenge = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/challenges-post/",
        {
          method: "POST",
          body: JSON.stringify({
            tag,
            category,
            text,
            progress: {}, // PROGRESS IS NOW A USER MAP.
            goal,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @postChallenge: ", error.message);
    }
  },
  removeChallenge: async (challenge_id) => {
    try {
      let challenge = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/challenges-remove/" +
          challlenge_id,
        {
          method: "DELETE",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @removeChallenge: ", error.message);
    }
  },
  updateChallengeProgress: async (user_id, points, tag, category) => {
    try {
      let challenge = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/challenges-update-progress/" +
          user_id +
          "/" +
          points,
        {
          method: "PUT",
          body: JSON.stringify({
            tag,
            category,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @updateChallengeProgress: ", error.message);
    }
  },
  postComment: async (userpostId, userid, username, text) => {
    try {
      let comment = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/comment-post/",
        {
          method: "POST",
          body: JSON.stringify({
            userpostId,
            userid,
            username,
            text,
            reactions: 0,
            replies: [],
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @postComment: ", error.message);
    }
  },
  getComment: async (comment_id) => {
    try {
      let commentRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/comment-get/" +
          comment_id
      );
      return commentRaw.json();
    } catch (error) {
      console.log("Error @getComment: ", error.message);
    }
  },
  scanComments: async () => {
    try {
      let scanCommentsRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/comment-scan/"
      );
      return scanCommentsRaw.json();
    } catch (error) {
      console.log("Error @scanComments: ", error.message);
    }
  },
  updateComment: async (
    comment_id,
    userpostId,
    userid,
    username,
    text,
    reactions,
    replies
  ) => {
    try {
      let comment = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/comment-update/" +
          comment_id,
        {
          method: "PUT",
          body: JSON.stringify({
            userpostId,
            userid,
            username,
            text,
            reactions,
            replies,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @updateComment: ", error.message);
    }
  },
  deleteComment: async (comment_id) => {
    try {
      let challenge = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/comment-delete/" +
          comment_id,
        {
          method: "DELETE",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @deleteComment: ", error.message);
    }
  },
  scanUserpostComments: async (userpostId) => {
    try {
      let scanCommentsRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/comment-userpost-scan/" +
          userpostId
      );
      return scanCommentsRaw.json();
    } catch (error) {
      console.log("Error @scanUserpostComments: ", error.message);
    }
  },
  postMilestone: async (userid, tag, category, text, progress, goal) => {
    try {
      let milestone = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestones-post/",
        {
          method: "POST",
          body: JSON.stringify({
            userid,
            tag,
            category,
            text,
            progress,
            goal,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @postMilestone: ", error.message);
    }
  },
  getMilestone: async (milestone_id) => {
    try {
      let milestoneRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestones-get/" +
          milestone_id
      );
      return milestoneRaw.json();
    } catch (error) {
      console.log("Error @getComment: ", error.message);
    }
  },
  editMilestone: async (id, userid, tag, heading, text, progress) => {
    try {
      let milestone = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestones-edit/" +
          milestone_id,
        {
          method: "PUT",
          body: JSON.stringify({
            id,
            userid,
            tag,
            heading,
            text,
            progress,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @editMilestone: ", error.message);
    }
  },
  updateMilestoneProgress: async (milestones, numPoints, tag, category) => {
    try {
      let milestonesRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestones-progress/",
        {
          method: "PUT",
          body: JSON.stringify({
            milestones,
            numPoints,
            tag,
            category,
          }),
        }
      );
      return milestonesRaw.json();
    } catch (error) {
      console.log("Error @updateMilestoneProgress: ", error.message);
    }
  },
  deleteMilestone: async () => {
    try {
      let milestone = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestones-delete/" +
          milestone_id,
        {
          method: "DELETE",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @deleteMilestone: ", error.message);
    }
  },
  refreshMilestone: async (user_id, milestone_id) => {
    try {
      let milestoneRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/milestones-progress/" +
          user_id +
          "/" +
          milestone_id,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.log("Error @refreshMilestone: ", error.message);
    }
  },
  // postReply: () => {

  // },
  // getReply: () => {

  // },
  // scanReplies: () => {

  // },
  // updateReply: () => {

  // },
  // deleteReply: () => {

  // },
  // scanCommentReplies: () => {

  // },
  postUserpost: async (post) => {
    // tags is an array of tag strings. Essentially, user will choose tags to append to their post before they post and will be
    // put into this array before posting.
    try {
      const photo = await Firebase.getBlob(post.userpostPhotoUrl);
      const imageRef = firebase
        .storage()
        .ref("userpostPhotos")
        .child(Date.now() + post.uid);
      await imageRef.put(photo);
      const url = await imageRef.getDownloadURL();
      let response = await ImageUpload.analyzeWithGCPVision(url);
      if (response != null) {
        let safeSearchAnnotation = response.responses[0].safeSearchAnnotation;
        // if the image has adult, spoof, or racy tag as LIKLEY or VERY_LIKELY, return
        if (
          safeSearchAnnotation.adult == "LIKELY" ||
          safeSearchAnnotation.adult == "VERY_LIKELY" ||
          safeSearchAnnotation.spoof == "LIKELY" ||
          safeSearchAnnotation.spoof == "VERY_LIKELY" ||
          safeSearchAnnotation.racy == "LIKELY" ||
          safeSearchAnnotation.racy == "VERY_LIKELY" ||
          safeSearchAnnotation.violence == "LIKELY" ||
          safeSearchAnnotation.violence == "VERY_LIKELY"
        ) {
          console.warn("Post is inappropriate.");
          return;
        }
      }

      //await ImageUpload.analyzeWithGCPNLP(post.caption);

      let userpost = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-post/",
        {
          method: "POST",
          body: JSON.stringify({
            userid: post.uid,
            userpostPhotoUrl: url,
            tag: post.tag,
            reactions: 0,
            comments: [],
            reactionUsers: [],
            caption: post.caption,
            category: post.category,
            link: post.link,
            username: post.username,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @postUserpost: ", error.message);
    }
  },
  getUserpost: async (userpost_id) => {
    try {
      let userpostRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-get/" +
          userpost_id
      );
      return userpostRaw.json();
    } catch (error) {
      console.log("Error @getUserpost: ", error.message);
    }
  },
  scanUserposts: async () => {
    try {
      let scanUserpostsRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-scan/"
      );
      return scanUserpostsRaw.json();
    } catch (error) {
      console.log("Error @scanUserposts: ", error.message);
    }
  },
  updateUserpost: async (post) => {
    try {
      let userpost = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-update/" +
          post.id,
        {
          method: "PUT",
          body: JSON.stringify({
            userid: post.uid,
            userpostPhotoUrl: url,
            tag: post.tag,
            reactions: 0,
            comments: [],
            reactionUsers: [],
            caption: post.caption,
            category: post.category,
            link: post.link,
            username: post.username,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @updateUserpost: ", error.message);
    }
  },
  deleteUserpost: async (milestone_id) => {
    try {
      let userpost = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-delete/" +
          milestone_id,
        {
          method: "DELETE",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @deleteUserpost: ", error.message);
    }
  },
  // addUserpostTag: async (userpost_id, tag) => { DEFUNCT
  //     try {
  //         let tagAdd = await fetch('https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-add-tag/' + userpost_id + '/' + tag, {
  //             method: "POST"
  //         });
  //         return true;
  //     } catch (error) {
  //         console.log("Error @addUserpostTag: ", error.message);
  //     }
  // },
  // removeUserpostTag: async (userpost_id, tag) => {
  //     try {
  //         let tagRemove = await fetch('https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-add-tag/' + userpost_id + '/' + tag, {
  //             method: "POST"
  //         });
  //         return true;
  //     } catch (error) {
  //         console.log("Error @removeUserpostTag: ", error.message);
  //     }
  // },
  addUserpostReactionUser: async (userpost_id, reactionUserId) => {
    try {
      let reactionUser = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-add-reactionuser/" +
          userpost_id +
          "/" +
          reactionUserId,
        {
          method: "POST",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @addUserpostReactionUser: ", error.message);
    }
  },
  removeUserpostReactionUser: async (userpost_id, reactionUserId) => {
    try {
      let reactionUser = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-remove-reactionuser/" +
          userpost_id +
          "/" +
          reactionUserId,
        {
          method: "POST",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @removeUserpostReactionUser: ", error.message);
    }
  },
  scanUserUserposts: async (user_id) => {
    try {
      let scanUserpostsRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/userpost-user-scan/" +
          user_id
      );
      return scanUserpostsRaw.json();
    } catch (error) {
      console.log("Error @scanUserUserposts: ", error.message);
    }
  },
  postUser: () => {
    // TODO: use this in the createUser function below, make sure code elsewhere references same collection (userInfo vs users)
  },
  getUser: () => {
    // TODO: use this in the getUserInfo function below, make sure code elsewhere references same collection (userInfo vs users)
  },
  scanUsers: async () => {
    try {
      let scanUsersRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-scan/"
      );
      return scanUsersRaw.json();
    } catch (error) {
      console.log("Error @scanUsers: ", error.message);
    }
  },
  updateUser: async (
    user_id,
    points,
    tags,
    friends,
    userposts,
    challenges,
    milestones
  ) => {
    try {
      let user = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-update/" +
          user_id,
        {
          method: "PUT",
          body: JSON.stringify({
            points,
            tags,
            friends,
            userposts,
            challenges,
            milestones,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @updateUser: ", error.message);
    }
  },
  deleteUser: async (user_id) => {
    try {
      let userpost = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-delete/" +
          user_id,
        {
          method: "DELETE",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @deleteUser: ", error.message);
    }
  },
  addUserpost: () => {
    // Not API
  },
  addFriend: async (user_id, friend_id) => {
    try {
      let friend = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-add-friend/" +
          user_id +
          "/" +
          friend_id,
        {
          method: "PUT",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @addFriend: ", error.message);
    }
  },
  removeFriend: async (user_id, friend_id) => {
    try {
      let friend = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-remove-friend/" +
          user_id +
          "/" +
          friend_id,
        {
          method: "PUT",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @removeFriend: ", error.message);
    }
  },
  addTag: async (user_id, tag) => {
    try {
      let tagAdd = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-add-tag/" +
          user_id +
          "/" +
          tag,
        {
          method: "PUT",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @addTag: ", error.message);
    }
  },
  removeTag: async (user_id, tag) => {
    try {
      let tagRemove = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-remove-tag/" +
          user_id +
          "/" +
          tag,
        {
          method: "PUT",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @removeTag: ", error.message);
    }
  },
  incrementPoints: async (user_id, points, tag, category) => {
    try {
      let newPoints = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-increment-points/" +
          user_id +
          "/" +
          points,
        {
          method: "PUT",
          body: JSON.stringify({
            tag,
            category,
          }),
        }
      );
      return true;
    } catch (error) {
      console.log("Error @incrementPoints: ", error.message);
    }
  },

  updateAllPoints: async (user_id, points, tag, category) => {
    try {
      await Firebase.incrementPoints(user_id, points, tag, category);
      let userInfo = await Firebase.getUserInfo(user_id);
      let milestones = userInfo.milestones;
      let response = await Firebase.updateMilestoneProgress(
        milestones,
        points,
        tag,
        category
      );
      await Firebase.updateChallengeProgress(user_id, points, tag, category);
      return response.makeNewChallenge;
    } catch (error) {
      console.log("Error @updateAllPoints: ", error.message);
    }
  },

  getUpcomingFacts: async (user_id) => {
    try {
      let upcomingFacts = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/impact-facts-get/" +
          user_id
      );
      return upcomingFacts.json();
    } catch (error) {
      console.log("Error @getUpcomingFacts: ", error.message);
    }
  },
  clearUpcomingFacts: async (user_id) => {
    try {
      let upcomingFacts = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/impact-facts-clear/" +
          user_id,
        {
          method: "DELETE",
        }
      );
      return true;
    } catch (error) {
      console.log("Error @clearUpcomingFacts: ", error.message);
    }
  },
  checkActive: async () => {
    try {
      let activeUsers = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/notifications-check-active/"
      );
    } catch (error) {
      console.log("Error @checkActive: ", error.message);
    }
  },
  updateActive: async (user_id) => {
    try {
      let activeUser = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/notifications-update-active/" +
          user_id,
        {
          method: "PUT",
        }
      );
    } catch (error) {
      console.log("Error @updateActive: ", error.message);
    }
  },

  // addChallenge: async () => {
  //     try {
  //         let challenge = await fetch('https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-add-challenge/' + user_id + '/' + challenge_id, {
  //             method: "PUT"
  //         });
  //         return true;
  //     } catch (error) {
  //         console.log("Error @addChallenge: ", error.message);
  //     }
  // },
  // addMilestone: async () => {
  //     try {
  //         let milestone = await fetch('https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-add-milestone/' + user_id + '/' + milestone_id, {
  //             method: "PUT"
  //         });
  //         return true;
  //     } catch (error) {
  //         console.log("Error @addMilestone: ", error.message);
  //     }
  // },

  // auth functions
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },
  createUser: async (user) => {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);
      await Firebase.sendEmailVerification();

      const uid = Firebase.getCurrentUser().uid;
      let profilePhotoUrl = "default";

      let res = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-post/" +
          uid,
        {
          method: "POST",
          body: JSON.stringify({
            username: user.name,
            points: {},
            tags: [],
            friends: [],
            userposts: [],
            challenges: [],
            milestones: [],
            profilePhotoUrl: profilePhotoUrl,
          }),
        }
      );

      await db.collection("users").doc(uid).set({
        username: user.name,
        email: user.email,
        profilePhotoUrl,
      });

      if (user.profilePhoto) {
        profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto);
      }

      delete user.password;
      return { ...user, profilePhotoUrl, uid };
    } catch (error) {
      console.log("Error @createUser: ", error.message);
    }
  },
  uploadProfilePhoto: async (uri) => {
    const uid = Firebase.getCurrentUser().uid;

    try {
      const photo = await Firebase.getBlob(uri);
      const imageRef = firebase.storage().ref("profilePhotos").child(uid);
      await imageRef.put(photo);
      const url = await imageRef.getDownloadURL();

      await db.collection("users").doc(uid).update({
        profilePhotoUrl: url,
      });
      await db.collection("userInfo").doc(uid).update({
        profilePhotoUrl: url,
      });

      return url;
    } catch (error) {
      console.log("Error @uploadProfilePhoto: ", error.message);
    }
  },
  getBlob: async (uri) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new TypeError("Network request failed."));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  },
  getUserInfo: async (uid) => {
    try {
      // let currUserInfoId = JSON.parse(firebaseUser).userInfo;
      let currUserInfoRaw = await fetch(
        "https://us-central1-socialcompetitionapp.cloudfunctions.net/app/api/user-get/" +
          uid
      );
      return currUserInfoRaw.json();
    } catch (error) {
      console.log("Error @getUserInfo: ", error.message);
    }
  },
  getUserData: async (uid) => {
    try {
      const user = await db.collection("users").doc(uid).get();
      if (user.exists) {
        return user.data();
      }
    } catch (error) {
      console.log("Error @getUserInfo: ", error.message);
    }
  },
  sendEmailVerification: async () => {
    const user = Firebase.getCurrentUser();
    if (user) {
      user.sendEmailVerification();
    }
  },
  sendPasswordResetEmail: async (email) => {
    const user = Firebase.getCurrentUser();
    if (user) {
      firebase.auth().sendPasswordResetEmail(email);
    }
  },
  logOut: async () => {
    try {
      await firebase.auth().signOut();
      return true;
    } catch (error) {
      console.log("Error @logOut: ", error.message);
    }
    return false;
  },
  logIn: async (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },
  registerForPushNotification: async (uid) => {
    const { existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to our backend so we can use it to send pushes from there
    var updates = {};
    await db.collection("users").doc(uid).update({ expoToken: token.data });
  },
};

const FirebaseProvider = (props) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider, Firebase };
