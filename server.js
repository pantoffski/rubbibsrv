require('dotenv').config();
//server
const express = require('express');
const app = express();
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/runners/:tStamp', function (req, res) {
  var ret = [];
  runners.find({
    tagId: {
      $nin: ['', null]
    },
    tStamp: {
      $gte: req.params.tStamp
    }
  }).select({
    tagId: 1,
    bib_number: 1,
    name_on_bib: 1,
    first_name: 1,
    last_name: 1,
    tStamp: 1
  }).sort({
    tStamp: -1
  }).exec(function (err, result) {
    for (var i in result) {
      ret.push({
        tagId: result[i].tagId * 1,
        bibNo: result[i].bib_number * 1,
        bibName: result[i].name_on_bib,
        name: result[i].first_name + ' ' + result[i].last_name,
        tStamp: result[i].tStamp
      })
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(ret);
  })
});
app.listen((process.env.PORT || 5000), function () {
  console.log('listening to ' + process.env.PORT);
});
//mongo
var mongoose = require('mongoose');
mongoose.connect(process.env.ONG_MONGODB_URI, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var runnersSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  bib_number: {
    type: String,
    index: true
  },
  first_name: {
    type: String,
    index: true
  },
  last_name: {
    type: String,
    index: true
  },
  tagId: {
    type: String,
    index: true
  },
  name_on_bib: {
    type: String
  },
  raceCat: {
    type: String
  },
  tStamp: {
    type: Number,
    index: true
  }
}, {
  _id: false
});
var runners = mongoose.model('runner', runnersSchema);
