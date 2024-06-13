import { Profile } from "../models/profile.js"
import { Pet } from "../models/pet.js"
import { v2 as cloudinary } from 'cloudinary'

async function create(req, res) {
  req.body.owner = req.user.profile
  try {
    const pet = await Pet.create(req.body)
    console.log(`PET ${pet.name} CREATED`)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { pets: pet } },
      { new: true }
    )
    console.log(`OWNER FOR ${pet.name} FOUND`, JSON.stringify({profile}))
    pet.owner = profile
    console.log('PET PROFILE SET. RETURNING:', JSON.stringify({pet}))
    res.status(201).json(pet)
  } catch (error) {
    console.log('ERROR OCCURRED CREATING PET')
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
    console.log("** Retrieved Show petId:**", req.params.petId)
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
    const petToCheck = await Pet.findById(req.params.petId)
    if (petToCheck.owner.equals(req.user.profile)) {
      const pet = await Pet.findByIdAndUpdate(
        req.params.petId,
        req.body,
        {new: true}
      ).populate('owner')
      res.status(200).json(pet)
    } else {
      res.status(401).json({error: 'Not Authorized'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function addPhoto(req, res) {
  try {
    // console.log(`ADDING PET PHOTO`)
    // console.log(`----- REQ.FILES FOR ADD PET PHOTO -----`, {files: req.files})
      const imageFile = req.files.photo.path
      // console.log(`----- REQ.PARAMS FOR ADD PET PHOTO -----`, {params: req.params})
      const pet = await Pet.findById(req.params.petId)
      // console.log(`PET ${pet.name} FOUND WHEN ADDING PHOTO`)
      const image = await cloudinary.uploader.upload(
        imageFile,
        { tags: `${req.user.email}` }
      )
      // console.log(`IMAGE UPLOADED WITH TAGS ${req.user.email}`)
      pet.photo = image.url
      // console.log(`PET.PHOTO SET TO`, {url: image.url})
      await pet.save()
      // console.log(`PET SAVED WITH PHOTO`)
      res.status(201).json(pet.photo)
  } catch (err) {
      console.log(err)
      res.json(err)
  }
}

async function createVisit(req, res) {
  try {
    // 1. Find the pet by ID
    // console.log("** Retrieved petId:**", req.params.petId)
    // console.log("** Request Body:**", req.body)
    const pet = await Pet.findById(req.params.petId)
    .populate('visits')
    // console.log("** Found Pet:**", pet ? pet._id : null)
    // 2. Check if pet exists
    if (!pet || !pet.visits) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    // 3. Add new visit to pet's visits array
    pet.visits.push(req.body)
    // console.log("req.body:", req.body)
    // console.log("** Updated Pet Visits:**", pet.visits)
    // 4. Save the updated pet object with the new visit
    await pet.save()
    // console.log("** Saved Pet Object:**", pet._id)
    // 5. Retrieve the newly created visit
    const newVisit = pet.visits.at(-1)
    // 6. Send successful response with the new visit
    res.status(201).json(newVisit)
  } catch (error) {
    res.status(500).json(error)
    }
  }

  async function addVisitPhoto(req, res) {
    try {
      const imageFile = req.files.photo.path
      const image = await cloudinary.uploader.upload(
        imageFile,
        { tags: `${req.user.email}` }
      )
      const visitId = req.params.visitId
      const pet = await Pet.findById(req.params.petId)
      const visitToUpdate = pet.visits.id(visitId)
      if (visitToUpdate) {
        visitToUpdate.photo = image.url
        await pet.save()
        res.status(201).json({ message: 'Visit photo uploaded successfully' })
      } else {
        res.status(404).json({ message: 'Visit not found' })
      }
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  }

const updateVisit = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId)
    const visit = pet.visits.id(req.body._id)
    visit.visitReason = req.body.visitReason
    visit.visitDate = req.body.visitDate
    visit.urgent = req.body.urgent
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

export {
  addVisitPhoto,
  createVisit,
  deleteVisit,
  updateVisit,

  addPhoto,
	create,
	index,
	show,
	update
}
