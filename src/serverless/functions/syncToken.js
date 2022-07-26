/* global Twilio Runtime */
'use strict';

const AccessToken = Twilio.jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

module.exports.handler = async (context, event, callback) => {
  const {
    ACCOUNT_SID,
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET,
    TWILIO_SYNC_SERVICE_SID,
    ROOM_TYPE,
    CONVERSATIONS_SERVICE_SID,
  } = context;

  //   skip auth for now
  //   const authHandler = require(Runtime.getAssets()['/auth-handler.js'].path);
  //   authHandler(context, event, callback);

  const { user_identity, room_name, create_room = true, create_conversation = false } = event;

  let response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  // Create token
  const token = new AccessToken(ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });

  // Add participant's identity to token
  token.identity = context.identity;

  // Add sync grant to token
  const syncGrant = new SyncGrant({ serviceSid: TWILIO_SYNC_SERVICE_SID || 'default' });
  token.addGrant(syncGrant);

  // Return token
  response.setStatusCode(200);
  response.setBody({ token: token.toJwt(), identity: token.identity });
  return callback(null, response);
};
