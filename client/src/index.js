import Router from '@/router/router'

import '@/styles/main.scss'

const storage = require('@/core/services/storage.service')
const app = document.getElementById('app')
const router = new Router(app)

router.init()
