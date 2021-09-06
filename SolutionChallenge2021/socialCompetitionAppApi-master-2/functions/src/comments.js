const functions = require("firebase-functions");
const {firestore} = require('firebase-admin');

const {addComment} = require('./userPosts.js');

module.exports = {
    postComment: async (req, res, db) => {
        const body = JSON.parse(req.body);

        console.log(body);
        console.log(body.userpostId);

        try {
            await db.collection('comments')
                .add({
                    userpostId: body.userpostId,
                    userid: body.userid,
                    username: body.username,
                    text: body.text,
                    reactions: body.reactions,
                    replies: body.replies,
                    timestamp: Date.now()
                })
                .then((docRef) => {
                    addComment(docRef.id, body.userpostId, db);
                })
                .catch((error) => {
                    console.log("Error adding comment: ", error);
                })

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    getComment: async (req, res, db) => {
        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanComments: async (req, res, db) => {
        try {
            let query = db.collection('comments');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    userpostId: doc.data().userpostId,
                    userid: doc.data().userid,
                    username: doc.data().username,
                    text: doc.data().text,
                    reactions: doc.data().reactions,
                    replies: doc.data().replies
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

    updateComment: async (req, res, db) => {
        const body = JSON.parse(req.body);

        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            await document.update({
                userpostId: body.userpostId,
                userid: body.userid,
                username: body.username,
                text: body.text,
                reactions: body.reactions,
                replies: body.replies
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    deleteComment: async (req, res, db) => {
        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    addReply: async (reply_id, comment_id, db) => { // NOT API
        try {
            const document = db.collection('comments').doc(comment_id);
            await document.update({
                replies: firestore.FieldValue.arrayUnion(reply_id),
            });
            return "Successful updating comments!";
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    addCommentReaction: async (req, res, db) => { // NOT API
        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            await document.update({
                reactions: firestore.FieldValue.increment(1),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    removeCommentReaction: async (req, res, db) => { // NOT API
        try {
            const document = db.collection('comments').doc(req.params.comment_id);
            await document.update({
                reactions: firestore.FieldValue.increment(-1),
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    scanUserpostComments: async (req, res, db) => {
        try {
            let query = db.collection('comments').where("userpostId", "==", req.params.userpost_id).orderBy("timestamp", "desc");
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        userpostId: doc.data().userpostId,
                        userid: doc.data().userid,
                        username: doc.data().username,
                        text: doc.data().text,
                        reactions: doc.data().reactions,
                        replies: doc.data().replies,
                        timestamp: doc.data().timestamp
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
}