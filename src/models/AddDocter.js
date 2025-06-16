import mongoose from 'mongoose';

const AddDocterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    center : {
        type: String,
        required: true,
    },
    sangh: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sangh',
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    }, { timestamps: true });

const AddDocter = mongoose.models.AddDocter || mongoose.model('AddDocter', AddDocterSchema);
export default AddDocter;
