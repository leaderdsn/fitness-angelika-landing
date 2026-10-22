import { collectStats } from '../../utils/stats'

const STATS_DAYS = 30

export default defineEventHandler(() => collectStats(useStorage('data'), STATS_DAYS))
