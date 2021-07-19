var mongoose = require('mongoose');

var UplinkSchema = new mongoose.Schema({
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    upload: {type: mongoose.Schema.Types.ObjectId, ref: 'Upload'}
}, {timestamps: true, usePushEach: true});

// Requires population of author
UplinkSchema.methods.toJSONFor = function (user) {
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        author: this.author.toProfileJSONFor(user)
    };
};

mongoose.plugin(UplinkSchema => {
    UplinkSchema.options.usePushEach = true
});
mongoose.model('Uplink', UplinkSchema);
