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

async function show(req, res) {
  try {
    const pet = await Pet.findById(req.params.petId)
      .populate(['owner'])
    res.status(200).json(pet)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function update(req, res) {
  try {
    const pet = await Pet.findByIdAndUpdate(
      req.params.petId,
      req.body,
      { new: true }
    ).populate('owner')
    res.status(200).json(pet)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function createVisit(req, res) {
  try {
    const pet = await Pet.findById(req.params.petId)
    pet.visits.push(req.body)
    await pet.save()
    const newVisit = pet.visits.at(-1)
    res.status(201).json(newVisit)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateVisit = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId)
    const visit = pet.visits.id(req.body._id)
    visit.visitReason = req.body.visitReason
    await pet.save()
    res.status(200).json(pet)
  } catch (err) {
    res.status(500).json(err)
  }
}

export {
  createVisit,
  updateVisit,

	create,
	index,
	show,
	update,
}