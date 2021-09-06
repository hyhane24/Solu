const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');
const {addMilestone, addPoints, removeMilestone} = require('./users.js');

module.exports = {
    postMilestone: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            await db.collection('milestones')
                .add({
                    userid: body.userid,
                    tag: body.tag,
                    category: body.category,
                    text: body.text,
                    progress: body.progress,
                    goal: body.goal
                })
                .then((docRef) => {
                    addMilestone(docRef.id, body.userid, db);
                })
                .catch((error) => {
                    console.log("Error adding milestone: ", error);
                })

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getMilestone: async (req, res, db) => {
        try {
            const document = db.collection('milestones').doc(req.params.milestone_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    editMilestone: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('milestones').doc(req.params.milestone_id);
            await document.update({
                id: body.id,
                userid: body.userid,
                tag: body.tag,
                category: body.category,
                text: body.text,
                progress: body.progress,
                goal: body.goal
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    updateMilestoneProgress: async (req, res, db) => {
        /**
         * body:{
         *      milestones: user array[2]
         *      numPoints: int
         *      tag: string
         *      category: string
         * }
         */
        try {
            const body = JSON.parse(req.body);
            
            let makeNewChallenge = 0;

            for (let i = 0; i < body.milestones.length; i++) {
                let document = db.collection('milestones').doc(body.milestones[i]);
                let item = await document.get();
                let milestoneInfo = item.data();

                if (milestoneInfo.tag == body.tag && milestoneInfo.category == body.category) {
                    if (milestoneInfo.progress + body.numPoints >= milestoneInfo.goal) { // meets goal
                        await removeMilestone(milestoneInfo.userid, body.milestones[i], db);
                        makeNewChallenge += 1;
                    } else { // did not meet goal
                        await module.exports.updateMilestonePoints(body.milestones[i], body.numPoints, db);
                    }
                }
            }

            // let document = db.collection('milestones').doc(req.params.milestone_id);
            // let item = await document.get();
            // let milestoneInfo = item.data().json();
            
            // let makeNewChallenge = await addPoints(body.user_id, req.params.milestone_id, milestoneInfo.tag, milestoneInfo.category, req.params.points, milestoneInfo.goal, db);
            
            // if (!makeNewChallenge) {
            //     await document.update({
            //         progress: firestore.FieldValue.increment(req.params.points),
            //     });
            // }

            return res.status(200).send({ 
                "makeNewChallenge": makeNewChallenge
            });
        } catch (error) {
            console.log(error);
        }
    },

    deleteMilestone: async (req, res, db) => {
        try {
            const document = db.collection('milestones').doc(req.params.milestone_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    updateMilestonePoints: async (milestone_id, numPoints, db) => {
        try {
            const document = db.collection('milestones').doc(milestone_id);
            await document.update({
                progress: firestore.FieldValue.increment(numPoints)
            })
        } catch (error) {
            console.log(error);
        }
    },

    refreshMilestone: async (req, res, db) => {
        try {
            await removeMilestone(req.params.user_id, req.params.milestone_id, db);
            const document = db.collection('milestones').doc(req.params.milestone_id);
            await document.delete();
            return res.status(200).send({ 
                "makeNewChallenge": makeNewChallenge
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
}