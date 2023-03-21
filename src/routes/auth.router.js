import { Router } from 'express'
import * as AuthController from '../controllers/aut.controller.js'

const router = Router()

router.post('/login', AuthController.login)

module.exports = router
