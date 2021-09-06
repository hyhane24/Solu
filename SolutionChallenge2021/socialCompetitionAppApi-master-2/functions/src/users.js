const {firestore} = require('firebase-admin')
const {addImpactFact} = require('./impactFacts.js');
const {sendNotification} = require('./expoNotifications.js');

module.exports = {
    postUser: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('userInfo').doc(req.params.uid)
            .set({
                    username: body.username,
                    points: body.points, // arr that gets added to
                    tags: body.tags,
                    friends: body.friends,
                    userposts: body.userposts,
                    challenges: body.challenges,
                    milestones: body.milestones,
                    profilePhotoUrl: body.profilePhotoUrl
                });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getUser: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanUsers: async (req, res, db) => {
        try {
            let query = db.collection('userInfo');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    username: doc.data().username,
                    userInfoId: doc.data().userInfoId,
                    points: doc.data().points,
                    tags: doc.data().tags,
                    friends: doc.data().friends,
                    userposts: doc.data().userposts,
                    challenges: doc.data().challenges,
                    milestones: doc.data().milestones,
                    profilePhotoUrl: doc.data().profilePhotoUrl
                };
                response.push(selectedItem);
            }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    updateUser: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                username: body.username,
                points: body.points,
                tags: body.tags,
                friends: body.friends,
                userposts: body.userposts,
                challenges: body.challenges,
                milestones: body.milestones,
                profilePhotoUrl: body.profilePhotoUrl
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deleteUser: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addUserpost: async (userpost_id, user_id, db) => { // NOT API
        try {
            const document = db.collection('userInfo').doc(user_id);
            await document.update({
                userposts: firestore.FieldValue.arrayUnion(userpost_id),
            });
            return "Successful updating userposts!";
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    addFriend: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                friends: firestore.FieldValue.arrayUnion(req.params.friend_id),
            });
            let item = await document.get();
            let userData = item.data();
            if (userData.friends.length <= 20) {
                await sendNotification(friend_id, 'New follower!', 
                `${userData.username} is now following you. Consider following them back!`, db);
            }
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeFriend: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                friends: firestore.FieldValue.arrayRemove(req.params.friend_id),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addTag: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                tags: firestore.FieldValue.arrayUnion(req.params.tag)
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeTag: async (req, res, db) => {
        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            await document.update({
                tags: firestore.FieldValue.arrayRemove(req.params.tag),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    incrementPoints: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('userInfo').doc(req.params.user_id);
            let item = await document.get();
            let userInfo = item.data();

            // let milestones = userinfo.milestones;
            // for (let i = 0; i < milestones.length; i++) {
                
            // }


            let pointsMap = userInfo.points;

            if (pointsMap[body.tag] == undefined) {
                pointsMap[body.tag] = {
                    "Thoughts": 0,
                    "Volunteering": 0,
                    "Activism": 0,
                    "Contribution": 0,
                    "Awareness": 0
                }
            }

            pointsMap[body.tag][body.category] += parseInt(req.params.points, 10);
            
            try {
                 addImpactFact(req.params.user_id, null, 'category', pointsMap[body.tag][body.category], body.tag, body.category, db);
            } catch (error) {
                console.log(error);
            }
            
            await document.update({
                points: userInfo.points
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addChallenge: async (user_id, challenge_id, db) => {
        try {
            const document = db.collection('userInfo').doc(user_id);
            await document.update({
                challenges: firestore.FieldValue.arrayUnion(challenge_id),
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    addMilestone: async (milestone_id, userid, db) => { // NOT API
        try {
            const document = db.collection('userInfo').doc(userid);
            await document.update({
                milestones: firestore.FieldValue.arrayUnion(milestone_id),
            });
        } catch (error) {
            console.log(error);
        }
    },

    removeMilestone: async (user_id, milestone_id, db) => { // NOT API
        try {
            const document = db.collection('userInfo').doc(user_id);
            await document.update({
                milestones: firestore.FieldValue.arrayRemove(milestone_id),
            });
        } catch (error) {
            console.log(error);
        }
    },

    getExpoToken: async (user_id, db) => { // NOT API
        try {
            const document = db.collection('users').doc(user_id);
            let item = await document.get();
            let response = item.data().expoToken;
            return response;
        } catch (error) {
            console.log(error);
        }
    },

    // addPoints: async (user_id, milestone_id, tag, category, numPoints, maxPoints, db) => { // NOT API
    //     try {
    //         const document = db.collection('userInfo').doc(user_id);
    //         let item = await document.get();
    //         let userInfo = item.data().json();

    //         let makeNewChallenge = false;

    //         // let index = null;
    //         // for (let i = 0; i < userInfo.tags.length; i++) {
    //         //     if (tag.localeCompare(userInfo.tags[index])) {
    //         //         index = i;
    //         //         break;
    //         //     }
    //         // }

    //         let pointsMap = userInfo.points;
    //         pointsMap[tag][category] += numPoints;

    //         // if (index != null) {
    //         //     let categoryIndex = 0; // Thoughts

    //         //     if (category == "Volunteering") {
    //         //         categoryIndex = 1;
    //         //     } else if (category == "Activism") {
    //         //         categoryIndex = 2;
    //         //     } else if (category == "Contribution") {
    //         //         categoryIndex = 3;
    //         //     } else if (category == "Awareness") {
    //         //         categoryIndex = 4;
    //         //     }

    //         //     userInfo.points[index][categoryIndex] += numPoints;

    //         if (pointsMap[tag][category] >= maxPoints) {
    //             module.exports.removeMilestone(user_id, milestone_id);
    //             makeNewChallenge = true;
    //         }

    //         await document.update({
    //             points: userInfo.points
    //         });

    //         return makeNewChallenge;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}