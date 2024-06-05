import mongoose from 'mongoose'

const Schema = mongoose.Schema

const visitSchema = new Schema(
  {
    photo: {
      type: String,
    },
    visitReason: {
      type: String,
      required: true,
    },
    visitDate: {
      type: Date,
      required: true, 
    },
    urgent: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
)

const petSchema = new Schema(
  {
    owner: { 
      type: Schema.Types.ObjectId, ref: 'Profile' 
    },    
    photo: {
      type: String,
    },
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
    birthDate: {
      type: Date,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ['Female', 'Spayed', 'Male', 'Neutered'],
    },
    elixir: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: [String]
    },
    medications: {
      type: [String]
    },
    allergies: {
      type: [String]
    },
    vetName: {
      type: String,
      required: true,
    },
    visits: [visitSchema]
  },
  { timestamps: true }
)

const Pet = mongoose.model('Pet', petSchema)

export { Pet }