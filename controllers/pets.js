import { Profile } from "../models/profile.js"
import { Pet } from "../models/pet.js"

async function create(req, res) {
  try {
    req.body.owner = req.user.profile
    const pet = await Pet.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { pets: pet } },
      { new: true }
    )
    pet.author = profile
    res.status(201).json(pet)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function index(req, res) {
  try {
    const pets = await Pet.find({})
      .populate('owner')
      .sort({ createdAt: 'desc' })
    res.status(200).json(pets)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export {
  create,
  index,
}