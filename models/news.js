let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let newsSchema = new Schema({
    userId:{
        type: String
    },
    date:{
        type: String
    },
    text:{
        type: String
    },
    theme:{
        type: String
    },
    id:{
        type: String
    },
    user:{
        type: String
    }
});

mongoose.model('news', newsSchema);