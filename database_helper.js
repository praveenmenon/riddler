'use strict';
module.change_code = 1;
const riddlersskillconfig = require('./riddlerSkillConfig.json');
const tableName = riddlersskillconfig.table_name;
const credentials = {
  accessKeyId: riddlersskillconfig.access_key_id,
  secretAccessKey: riddlersskillconfig.secret_key_id,
  region: 'us-east-1'
};
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient(credentials);

function RiddlerHelper() {}

RiddlerHelper.prototype.readRiddleQuestions = (riddleId, callback) => {
  const queryRiddleRow = {
    TableName: 'riddles',
    Key: {
      'riddle_id': riddleId
    }
  };

  return docClient.get(queryRiddleRow, (err, data) => {
    if (err) {
      callback( JSON.stringify(err, null, 2), null);
    } else if (!data.Item) {
      callback('NO record found!!', null);
    } else {
      callback(null, data.Item);
    }
  });
};

RiddlerHelper.prototype.readStoryQuestions = (storyId, callback) => {
  const queryStoryRow = {
    TableName: 'stories',
    Key: {
      'story_id': storyId
    }
  };

  return docClient.get(queryStoryRow, (err, data) => {
    if (err) {
      callback( JSON.stringify(err, null, 2), null);
    } else if (!data.Item) {
      callback('NO record found!!', null);
    } else {
      callback(null, data.Item);
    }
  });
};

RiddlerHelper.prototype.saveUserState = function(deviceId, riddleId, riddle, attemptedRiddles, storyId, story, attemptedStories, lastPlayed, callback) {
  console.log('deviceId:', deviceId);
  console.log('attemptedRiddles:', attemptedRiddles);
  console.log('attemptedStories:', attemptedStories);
  const params = {
    TableName: 'riddle_users',
    Item: {
      'deviceId': deviceId,
      'riddle_id': riddleId,
      'story_id': storyId,
      'story': story,
      'riddle': riddle,
      'attempted_riddles': attemptedRiddles,
      'attempted_stories': attemptedStories,
      'last_played': lastPlayed
    }
  };

  docClient.put(params, (err, data) => {
    console.log('data:', data);
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

RiddlerHelper.prototype.readUserDetails = (deviceId, callback) => {
  console.log('deviceId:', deviceId);
  const queryUserDetails = {
    TableName: 'riddle_users',
    Key: {
      'deviceId': deviceId
    }
  };

  return docClient.get(queryUserDetails, (err, data) => {
    if (err) {
      callback( JSON.stringify(err, null, 2), null);
    } else if (!data.Item) {
      callback(null, 'NO record found!!');
    } else {
      callback(null, data.Item);
    }
  });
};

module.exports = RiddlerHelper;
