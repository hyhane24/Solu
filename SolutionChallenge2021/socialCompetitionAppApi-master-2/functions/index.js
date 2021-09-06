const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({origin: true}));

// Service account
const serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialcompetitionapp..firebaseio.com",
});
const db = admin.firestore();

// BEGINNING OF FUNCTIONS

// app.get('/hello-world', (req, res) => {
//   return res.status(200).send('Hello World!');
// });

// USERPOSTS

const {
    postUserpost, 
    getUserpost, 
    scanUserposts, 
    updateUserpost, 
    deleteUserpost,
    scanUserUserposts,
    addUserpostReaction,
    removeUserpostReaction,
    addUserpostTag,
    removeUserpostTag,
    addUserpostReactionUser,
    removeUserpostReactionUser
} = require("./src/userPosts.js");

/*
JSON Format:
{
    "userid": String - user's id,
    "userpostPhotoUrl": String - userpost's photo,
    "tags": Str array - list of tags,
    "reactions": int - number of likes,
    "comments": int arr - ids of comments
}
*/

app.post("/api/userpost-post", (req, res) => {
  postUserpost(req, res, db);
});

// GET USERPOST
app.get("/api/userpost-get/:userpost_id", (req, res) => {
  getUserpost(req, res, db);
});

// SCAN USERPOSTS
app.get("/api/userpost-scan", (req, res) => {
  scanUserposts(req, res, db);
});

// UPDATE USERPOST
app.put("/api/userpost-update/:userpost_id", (req, res) => {
  updateUserpost(req, res, db);
});

// DELETE USERPOST
app.delete("/api/userpost-delete/:userpost_id", (req, res) => {
  deleteUserpost(req, res, db);
});

// USERPOST ADD REACTION
app.post("/api/userpost-add-reaction/:userpost_id", (req, res) => {
  addUserpostReaction(req, res, db);
});

// USERPOST REMOVE REACTION
app.post("/api/userpost-remove-reaction/:userpost_id", (req, res) => {
  removeUserpostReaction(req, res, db);
});

// // USERPOST ADD TAG
// app.post("/api/userpost-add-tag/:userpost_id/:tag", (req, res) => {
//   addUserpostTag(req, res, db);
// });

// // USERPOST REMOVE TAG
// app.post("/api/userpost-remove-tag/:userpost_id/:tag", (req, res) => {
//   removeUserpostTag(req, res, db);
// });

// USERPOST ADD REACTIONUSER
app.post("/api/userpost-add-reactionuser/:userpost_id/:reaction_userid", (req, res) => {
  addUserpostReactionUser(req, res, db);
});

// USERPOST REMOVE REACTIONUSER
app.post("/api/userpost-remove-reactionuser/:userpost_id/:reaction_userid", (req, res) => {
  removeUserpostReactionUser(req, res, db);
});

// SCAN USER USERPOSTS
app.get("/api/userpost-user-scan/:user_id", (req, res) => {
  scanUserUserposts(req, res, db);
});

// COMMENTS

const {
    getComment, 
    postComment,
    scanComments, 
    updateComment, 
    deleteComment,
    scanUserpostComments,
    addCommentReaction,
    removeCommentReaction,
} = require("./src/comments.js");

/*
JSON Format:
{
    "userpostId": integer - parent userpostId,
    "userid": String - user's id,
    "text": String - actual comment text,
    "reactions": integer - likes (could be expanded to an array if more types of reactions),
    "replies": int array - ids of replies
}

NOTE: Write function to update parent userPost with comment
*/
app.post("/api/comment-post", (req, res) => {
  postComment(req, res, db);
});

// GET COMMENT
app.get("/api/comment-get/:comment_id", (req, res) => {
  getComment(req, res, db);
});

// SCAN COMMENTS
app.get("/api/comment-scan", (req, res) => {
  scanComments(req, res, db);
});

// UPDATE COMMENT
app.put("/api/comment-update/:comment_id", (req, res) => {
  updateComment(req, res, db);
});

// DELETE COMMENT
app.delete("/api/comment-delete/:comment_id", (req, res) => {
  deleteComment(req, res, db);
});

// COMMENT ADD REACTION
app.post("/api/comment-add-reaction/:comment_id", (req, res) => {
  addCommentReaction(req, res, db);
});

// COMMENT REMOVE REACTION
app.post("/api/comment-remove-reaction/:comment_id", (req, res) => {
  removeCommentReaction(req, res, db);
});

// SCAN USERPOST COMMENTS
app.get("/api/comment-userpost-scan/:userpost_id", (req, res) => {
  scanUserpostComments(req, res, db);
});

// REPLIES

const {
    postReply, 
    getReply, 
    scanReplies, 
    updateReply, 
    deleteReply,
    scanCommentReplies,
    addReplyReaction,
    removeReplyReaction,
} = require("./src/replies.js");


/*
JSON Format:
{
    "commentId": integer - parent comment's id,
    "userid": String - user's id,
    "text": String - actual reply text,
    "reactions": integer - likes (could be expanded to an array if more types of reactions),
}

NOTE: Write function to update parent comment with reply
*/
app.post("/api/reply-post", (req, res) => {
  postReply(req, res, db);
});

// GET REPLY
app.get("/api/reply-get/:comment_id", (req, res) => {
  getReply(req, res, db);
});

// SCAN REPLIES
app.get("/api/reply-scan", (req, res) => {
  scanReplies(req, res, db);
});

// UPDATE REPLY
app.put("/api/reply-update/:reply_id", (req, res) => {
  updateReply(req, res, db);
});

// DELETE REPLY
app.delete("/api/reply-delete/:reply_id", (req, res) => {
  deleteReply(req, res, db);
});

// REPLY ADD REACTION
app.post("/api/reply-add-reaction/:reply_id", (req, res) => {
  addReplyReaction(req, res, db);
});

// COMMENT REPLY REACTION
app.post("/api/reply-remove-reaction/:reply_id", (req, res) => {
  removeReplyReaction(req, res, db);
});

// SCAN COMMENT REPLIES
app.get("/api/reply-comment-scan/:comment_id", (req, res) => {
  scanCommentReplies(req, res, db);
});


// USERS

const {
    postUser, 
    getUser, 
    scanUsers, 
    updateUser, 
    deleteUser, 
    addFriend, 
    removeFriend, 
    addTag, 
    removeTag, 
    addChallenge, 
    addMilestone,
    incrementPoints
} = require("./src/users.js");

/*
JSON Format:
{
    "points": integer - social competition points,
    "tags": Str arr - array of the user's tags,
    "friends": Str arr - array of the user's friends' ids,
    "userposts": int arr - array of the user's userposts' ids,
    "challenges": int arr - array of the user's completed challenges,
    "milestones": int arr - array of the user's milestones,
}
*/

// POST USER
app.post("/api/user-post/:uid", (req, res) => {
  postUser(req, res, db);
});

// GET USER
app.get("/api/user-get/:user_id", (req, res) => {
  getUser(req, res, db);
});

// SCAN USERS
app.get("/api/user-scan", (req, res) => {
  scanUsers(req, res, db);
});

// UPDATE USER
app.put("/api/user-update/:user_id", (req, res) => {
  updateUser(req, res, db);
});

// DELETE USER
app.delete("/api/user-delete/:user_id", (req, res) => {
  deleteUser(req, res, db);
});

// ADD FRIEND
app.put("/api/user-add-friend/:user_id/:friend_id", (req, res) => {
  addFriend(req, res, db);
});

// REMOVE FRIEND
app.put("/api/user-remove-friend/:user_id/:friend_id", (req, res) => {
  removeFriend(req, res, db);
});

// ADD TAG
app.put("/api/user-add-tag/:user_id/:tag", (req, res) => {
  addTag(req, res, db);
});

// REMOVE TAG
app.put("/api/user-remove-tag/:user_id/:tag", (req, res) => {
  removeTag(req, res, db);
});

// // ADD CHALLENGE
// app.put("/api/user-add-challenge/:user_id/:challenge_id", (req, res) => {
//   addChallenge(req, res, db);
// });

// ADD MILESTONE
app.put("/api/user-add-milestone/:user_id/:milestone_id", (req, res) => {
  addMilestone(req, res, db);
});

// INCREMENT POINTS
app.put("/api/user-increment-points/:user_id/:points", (req, res) => {
  incrementPoints(req, res, db);
});

// CHALLENGES
const {
    getChallenge, 
    getCurrentChallenge,
    postChallenge, 
    removeChallenge,
    updateChallengeProgress
} = require("./src/challenges.js");

// POST CHALLENGE
app.post("/api/challenges-post", (req, res) => {
  postChallenge(req, res, db);
});

// GET CHALLENGE
app.get("/api/challenges-get", (req, res) => {
  getChallenge(req, res, db);
});

// GET CURRENT CHALLENGE
app.get("/api/challenges-get-current", (req, res) => {
  getCurrentChallenge(req, res, db);
});

// REMOVE CHALLENGE
app.delete("/api/challenges-remove/:challenge_id", (req, res) => {
  removeChallenge(req, res, db);
});

// UPDATE CHALLENGE PROGRESS
app.put("/api/challenges-update-progress/:user_id/:points", (req, res) => {
  updateChallengeProgress(req, res, db);
});

// MILESTONES
const {
    postMilestone, 
    editMilestone, 
    deleteMilestone, 
    getMilestone,
    updateMilestoneProgress,
    refreshMilestone
} = require("./src/milestones.js");

// SET MILESTONE
app.post("/api/milestones-post/", (req, res) => {
  postMilestone(req, res, db);
});

// EDIT MILESTONE
app.put("/api/milestones-edit/:milestone_id", (req, res) => {
  editMilestone(req, res, db);
});

// DELETE MILESTONE
app.put("/api/milestones-delete/:milestone_id", (req, res) => {
  deleteMilestone(req, res, db);
});

// GET MILESTONE
app.get("/api/milestones-get/:milestone_id", (req, res) => {
  getMilestone(req, res, db);
});

// UPDATE MILESTONE PROGRESS
app.put("/api/milestones-progress/", (req, res) => {
  updateMilestoneProgress(req, res, db);
});

// REFRESH MILESTONE
app.delete("/api/milestones-refresh/:user_id/:milestone_id", (req, res) => {
  refreshMilestone(req, res, db);
});

// IMPACT FACTS
const {
  getUpcomingFacts,
  clearUpcomingFacts
} = require('./src/impactFacts.js');

// GET UPCOMING FACTS
app.get("/api/impact-facts-get/:user_id", (req, res) => {
  getUpcomingFacts(req, res, db);
});

// CLEAR UPCOMING FACTS
app.delete("/api/impact-facts-clear/:user_id", (req, res) => {
  clearUpcomingFacts(req, res, db);
});

// EXPO NOTIFICATIONS
const {checkAllActive, updateActive} = require('./src/expoNotifications');

// CHECK ALL ACTIVE
app.get("/api/notifications-check-active/", (req, res) => {
  checkAllActive(req, res, db);
});

// UPDATE ACTIVE
app.put("/api/notifications-update-active/:user_id", (req, res) => {
  updateActive(req, res, db);
});

exports.app = functions.https.onRequest(app);