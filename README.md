# Bunyan Mongoose Stream

**This is a fork of (https://github.com/traedamatic/bunyan-mongodb-stream) the original doesn't have compatibility with mongoose >=6, so I created this module based on the original.** 

A stream implementation for the bunyan logger https://github.com/trentm/node-bunyan. All log entries will be saved directly to your mongodb
instance. It is a very lower level implementation and has no external dependencies.

**The implementation requires a mongoose model for saving the log-data in the mongodb instance.**

# Install
 
```
npm install bunyan-mongoose-stream
```
or

```
npm install bunyan-mongoose-stream --save
```

# How To

* Install the npm bunyan-mongoose-stream package. ;)
* First to need to create a mongoose model. The package does not include a default model because the schema of the log-entry model may differ
from every use-case the logger will be used. You can add customer fields to mongodb document, just add the field to the schema and pass it to the bunyan logger. More information 
custom fields look here: https://github.com/trentm/node-bunyan#log-method-api. The example model includes two custom fields req and res. It is
important that those fields are not required, because not all logger calls will includes those fields. Otherwise the mongodb driver will throw 
a validation error.


**Example Model**

```javascript

'use strict';
const mongoose = require('mongoose');

/**
 * The schema of the log entry
 * @type {Mongoose.Schema}
 */
const LogEntrySchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    res : {
        type: Object
    },
    req : {
        type: Object
    }
});

const LogEntryModel = mongoose.model('Log', LogEntrySchema);
```
* Require and initialize the bunyan-mongoose-stream package.

```javascript
const LogEntryStream = require('bunyan-mongodb-stream')({model: LogEntryModel});
```

* Set up the bunyan logger and add the LogEntryStream to the streams array.

```javascript

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'YourLogger',
    streams: [
        {
            stream: LogEntryStream
        }
    ],
    serializers: bunyan.stdSerializers
});

```

* Use the logger as you already do.
