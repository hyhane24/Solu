const { Expo } = require('expo-server-sdk');

let expo = new Expo();

module.exports = {
    checkAllActive: async (req, res, db) => {
        try {
            let query = db.collection('users');
            let messages = [];
            await query.get().then(async (querySnapshot) => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    if (typeof doc.data().lastActive == "undefined") {
                        await db.collection('users').doc(doc.id)
                        .update({
                            lastActive: Date.now()
                        })
                    } else if (Date.now() - doc.data().lastActive > 604800 * tenCubed) { // 1 week in milliseconds
                        if (!Expo.isExpoPushToken(doc.data().expoToken)) {
                            console.error(`Push token ${doc.data().expoToken} is not a valid Expo push token`);
                        } else {
                            messages.push({
                                to: doc.data().expoToken,
                                title: 'We\'ve missed you!',
                                body: 'You\'ve been inactive for a while. Let\'s continue creating change with Solu!',
                            });
                            await db.collection('users').doc(doc.id)
                            .update({
                                lastActive: Date.now()
                            })
                        }
                    }
                }
            });

            let chunks = expo.chunkPushNotifications(messages);
            let tickets = await sendExpoNotifications(chunks);
            
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    updateActive: async (req, res, db) => {
        try {
            const document = db.collection('users').doc(req.params.user_id);
            await document.update({
                lastActive: Date.now()
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    sendNotification: async (userid, title, body, db) => { // NOT API
        try {
            let document = await db.collection('users').doc(userid);
            let item = await document.get();
            let response = item.data();

            if (!Expo.isExpoPushToken(response.expoToken)) {
                console.error(`Push token ${doc.data().expoToken} is not a valid Expo push token`);
            } else {
                let messages = [];
                
                messages.push({
                    to: response.expoToken,
                    title,
                    body
                });

                let chunks = expo.chunkPushNotifications(messages);
                let tickets = await sendExpoNotifications(chunks);
            }
        } catch (error) {
            console.log(error);
        }
    },

    sendMassNotification: async (title, body, db) => { // NOT API
        try {
            let query = db.collection('users');
            let messages = [];
            await query.get().then(async (querySnapshot) => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    if (!Expo.isExpoPushToken(doc.data().expoToken)) {
                        console.error(`Push token ${doc.data().expoToken} is not a valid Expo push token`);
                    } else {
                        messages.push({
                            to: doc.data().expoToken,
                            title,
                            body,
                        });
                    }
                }
            });

            let chunks = expo.chunkPushNotifications(messages);
            let tickets = await sendExpoNotifications(chunks);

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
}

async function sendExpoNotifications(chunks) {
    let tickets = [];
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
            console.error(error);
        }
    }
    return tickets;
}

const tenCubed = Math.pow(10, 3);