import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as petsCtrl from '../controllers/pets.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/', checkAuth, petsCtrl.create)
router.get('/', checkAuth, petsCtrl.index)
router.get('/:petId', checkAuth, petsCtrl.show)

export { router }
