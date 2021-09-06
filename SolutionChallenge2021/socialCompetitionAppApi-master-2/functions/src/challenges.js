const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');
const { updateComment } = require("./comments");
const { addChallenge } = require('./users.js');
const {sendMassNotification} = require('./expoNotifications.js');

module.exports = {
    postChallenge: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            let currChallenge = await module.exports.findCurrentChallenge(db);
            if (currChallenge !== "") {
                await module.exports.deprecateChallenge(currChallenge, db);
            }

            await db.collection('challenges')
                .add({
                    tag: body.tag,
                    category: body.category,
                    text: body.text,
                    progress: body.progress, // PROGRESS IS NOW A USER MAP.
                    goal: body.goal,
                    current: true // specifies if it is active
                })

            await sendMassNotification('New monthly challenge starting now!', 
                'Login to find out what this month\'s new challenge is!', db);

            return res.status(200).send({
                currChallenge
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getChallenge: async (req, res, db) => {
        try {
            const document = db.collection('challenges').doc(req.params.challenge_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getCurrentChallenge: async (req, res, db) => {
        try {
            let currChallenge = await module.exports.findCurrentChallenge(db);
            let document = db.collection('challenges').doc(currChallenge);
            let item = await document.get();
            let response = item.data();
            
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deprecateChallenge: async (challenge_id, db) => {
        try {
            const document = db.collection('challenges').doc(challenge_id);
            await document.update({
                current: false
            })
        } catch (error) {
            console.log(error);
        }
    },

    findCurrentChallenge: async (db) => {
        try {
            let currChallenge = "";

            let querySnapshot = await db.collection('challenges').where("current", "==", true).get()
            currChallenge = querySnapshot.docs[0].id;
            
            return currChallenge;
        } catch (error) {
            console.log(error);
        }
    },

    updateChallengeProgress: async (req, res, db) => {
        /**
         * body:
         * 
         *      {
         *          tag: 
         *          category:
         *       }
         */
        try {
            const body = JSON.parse(req.body);

            let currChallenge = await module.exports.findCurrentChallenge(db);
            let document = db.collection('challenges').doc(currChallenge);
            let item = await document.get();
            let currChallengeInfo = item.data();

            let points = parseInt(req.params.points, 10);
            
            if (currChallengeInfo.tag == body.tag && currChallengeInfo.category == body.category) {
                if (currChallengeInfo.progress[req.params.user_id] == undefined) { // no progress
                    currChallengeInfo.progress[req.params.user_id] = points;
                } else if (currChallengeInfo.progress[req.params.user_id] < currChallengeInfo.goal) { // not done with challenge
                    if (currChallengeInfo.progress[req.params.user_id] + points >= currChallengeInfo.goal) { // done with challenge
                        await addChallenge(req.params.user_id, currChallenge, db);
                    }
                    currChallengeInfo.progress[req.params.user_id] += points;
                } else { // already been done
                    return res.status(200).send();
                }

                await document.update({
                    progress: currChallengeInfo.progress
                })
            }

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeChallenge: async (req, res, db) => {
        try {
            const document = db.collection('challenges').doc(req.params.challenge_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}