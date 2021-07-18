var mongoose = require('mongoose');

var UsrupdateSchema = new mongoose.Schema({
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}
}, {timestamps: true, usePushEach: true});

// Requires population of author
UsrupdateSchema.methods.toJSONFor = function (user) {
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        author: this.author.toProfileJSONFor(user)
    };
};

mongoose.plugin(UsrupdateSchema => {
    UsrupdateSchema.options.usePushEach = true
});
mongoose.model('Usrupdate', UsrupdateSchema);
