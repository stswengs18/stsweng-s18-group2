const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpuSchema = new Schema({
    spu_name: {
        type: String,
        required: true,
        unique: false
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
}, { timestamps: true });

const Spu = mongoose.model('Spu', SpuSchema);
module.exports = Spu;