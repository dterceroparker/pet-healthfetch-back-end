import { Profile } from "../models/profile.js"
import { Pet } from "../models/pet.js"
import { v2 as cloudinary } from 'cloudinary'

async function create(req, res) {
  try {
    req.body.owner = req.user.profile
    const pet = await Pet.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { pets: pet } },
      { new: true }
    )
    pet.owner = profile
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

const deleteVisit = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId)
    pet.visits.remove({ _id: req.params.visitId })
    await pet.save()
    res.status(200).json(pet)
  } catch (err) {
    res.status(500).json(err)
  }
}

async function addPhoto(req, res) {
  try {
      const imageFile = req.files.photo.path
      const image = await cloudinary.uploader.upload(
        imageFile, 
        { tags: `${req.user.email}` }
      )
      const pet = await Pet.findById(req.params.petId)
      pet.photo = image.url
      await pet.save()
      res.status(201).json(pet.photo)
  } catch (err) {
      console.log(err)
      res.json(err)
  }
}

async function deletePhoto(req, res) {
  try {
      const pet = await Pet.findById(req.params.petId)
      pet.photo.slice(req.params.photoIdx, 1)
      await pet.save()
      res.status(200).json(pet)
  } catch (err) {
      console.log(err)
      res.json(err)
  }
}

async function addVisitPhoto(req, res) {
  try {
    const imageFile = req.files.photo.path
    const image = await cloudinary.uploader.upload(
    imageFile, 
    { tags: `${req.user.email}` }
    )
    const visit = await visit.findById(req.params.visitId)
    visit.photo = image.url
    res.status(201).json(visit.photo)
  } catch (err) {
      console.log(err)
      res.json(err)
  }
}

async function deleteVisitPhoto(req, res) {
  try {
    const visit = await visit.findById(req.params.visitId)
    visit.photo.slice(req.params.photoIdx, 1)
    res.status(200).json(visit)
} catch (err) {
    console.log(err)
    res.json(err)
}
}

export {
  createVisit,
  updateVisit,
  deleteVisit,
  addVisitPhoto,
  deleteVisitPhoto,

	create,
	index,
	show,
	update,
  addPhoto,
  deletePhoto
}