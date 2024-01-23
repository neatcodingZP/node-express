import mongoose from 'mongoose';
import {numberToNumberCode} from './number_to_number_code.js'

const Schema = mongoose.Schema;
const AppVersionSchema = new Schema({
    number: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    number_code: {
        type: Number,
        index: true,
        set: function() { 
            return numberToNumberCode(this.number)
        }
    },
    description: {
        type: String,
        required: false
    },
    updates: {
        type: String,
        required: false
    },
    is_actual: {
        type: Number,
        required: true
    },
    is_minimal: {
        type: Number,
        required: true
    },
    // created_at: {
    //     type: Date,
    //     default: Date.now
    // },
    created_at: {
        type: String,
        required: true
    }
});

export default mongoose.model('AppVersion', AppVersionSchema);