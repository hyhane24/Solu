const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');

const {sendNotification} = require('./expoNotifications.js');

const exclams = ['Wow! ', 'Incredible! ', 'Amazing! ', 'Unbelievable! ', 'Spectacular! '];

module.exports = {
    addImpactFact: async function (user_id, id, type, quantity, tag, category, db) {
        let document = db.collection('impactFacts').doc(user_id);
        let item = await document.get();

        if (!item.exists) {
            await db.collection('impactFacts').doc(user_id)
            .set({
                    upcoming: [],
                    commentMax: 0,
                    reactionMax: 0,
                    categoryMax: 0
            });
            let item = await document.get();
        }

        let response = item.data();
        let upcoming = response.upcoming;
        
        if (type == 'comment') {
            let max = response.commentMax;
            if (quantity > Math.floor(max * 1.25)) {
                max = quantity;
                let randomIndex = Math.floor(Math.random() * exclams.length);
                let fact = `${exclams[randomIndex]}One of your recent posts has achieved ${quantity} comments! Keep it up!`;
                upcoming.push({
                    fact,
                    id,
                    type,
                    quantity,
                    timestamp: Date.now()
                });
                await document.update({
                    commentMax: max,
                    upcoming: upcoming
                })
                await impactFactNotification(user_id, fact, db);
            }
        } else if (type == 'reaction') {
            let max = response.reactionMax;
            if (quantity > Math.floor(max * 1.25)) {
                max = quantity;
                let randomIndex = Math.floor(Math.random() * exclams.length);
                let fact = `${exclams[randomIndex]}One of your recent posts has achieved ${quantity} likes! Let's go!`;
                upcoming.push({
                    fact,
                    id,
                    type,
                    quantity,
                    timestamp: Date.now()
                });
                await document.update({
                    reactionMax: max,
                    upcoming: upcoming
                })
                await impactFactNotification(user_id, fact, db);
            }
        } else if (type == 'category') {
            let max = response.categoryMax;
            if (quantity > Math.floor(max * 1.25)) {
                max = quantity;
                let randomIndex = Math.floor(Math.random() * exclams.length);
                let fact = `${exclams[randomIndex]}You have achieved ${quantity} points in ${tag} - ${category}! Choo choo!`;
                upcoming.push({
                    fact,
                    id,
                    type,
                    quantity,
                    tag,
                    category,
                    timestamp: Date.now()
                });
                await document.update({
                    categoryMax: max,
                    upcoming: upcoming
                })
                await impactFactNotification(user_id, fact, db);
            }
        }
    },

    getUpcomingFacts: async function (req, res, db) {
        try {
            const document = db.collection('impactFacts').doc(req.params.user_id);
            let item = await document.get();
            let response = item.data().upcoming;
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    clearUpcomingFacts: async function (req, res, db) {
        try {
            const document = db.collection('impactFacts').doc(req.params.user_id);
            await document.update({
                upcoming: []
            })
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}

async function impactFactNotification(userid, body, db) {
    await sendNotification(userid, 'New impact fact!', body, db);
}