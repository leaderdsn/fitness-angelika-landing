import { isAdmin } from '../../utils/session'

export default defineEventHandler(async (event) => ({ authenticated: await isAdmin(event) }))
