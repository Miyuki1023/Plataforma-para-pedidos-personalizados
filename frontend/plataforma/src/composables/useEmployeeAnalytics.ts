import { ref, computed } from 'vue'
import { analyticsService, type WorkloadDataPoint } from '../services/analytics.service'

export type TimeRange = 'today' | 'yesterday' | 'week' | 'month'

interface TimeRangeOption {
  label: string
  value: TimeRange
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Últimos 7 días', value: 'week' },
  { label: 'Últimos 30 días', value: 'month' },
]

function getDateRange(range: TimeRange): { fecha_inicio: string; fecha_fin: string } {
  const now = new Date()
  const end = now.toISOString().split('T')[0]

  const start = new Date(now)
  switch (range) {
    case 'today':
      return { fecha_inicio: end, fecha_fin: end }
    case 'yesterday': {
      start.setDate(start.getDate() - 1)
      const yesterday = start.toISOString().split('T')[0]
      return { fecha_inicio: yesterday, fecha_fin: yesterday }
    }
    case 'week':
      start.setDate(start.getDate() - 6)
      return { fecha_inicio: start.toISOString().split('T')[0], fecha_fin: end }
    case 'month':
      start.setDate(start.getDate() - 29)
      return { fecha_inicio: start.toISOString().split('T')[0], fecha_fin: end }
  }
}

export function useEmployeeAnalytics() {
  const activeRange = ref<TimeRange>('today')
  const workloadData = ref<WorkloadDataPoint[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const cachedData = ref<Map<string, WorkloadDataPoint[]>>(new Map())

  const activeHours = computed(() => workloadData.value.map(d => d.hour))
  const activeValues = computed(() => workloadData.value.map(d => d.count))

  const maxVal = computed(() => Math.max(...activeValues.value, 5))
  const peakHour = computed(() => {
    const max = Math.max(...activeValues.value)
    if (max <= 0) return null
    const idx = activeValues.value.indexOf(max)
    return activeHours.value[idx] || null
  })
  const hasActivity = computed(() => peakHour.value !== null)

  async function fetchWorkload(range: TimeRange = activeRange.value) {
    const filter = getDateRange(range)
    const cacheKey = `${filter.fecha_inicio}_${filter.fecha_fin}`

    // Check cache first
    if (cachedData.value.has(cacheKey)) {
      workloadData.value = cachedData.value.get(cacheKey)!
      activeRange.value = range
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await analyticsService.getWorkload(filter)
      workloadData.value = data
      cachedData.value.set(cacheKey, data)
      activeRange.value = range
    } catch (err: any) {
      error.value = err?.message || 'Error al cargar analytics'
      console.error('[useEmployeeAnalytics] fetchWorkload error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    activeRange,
    activeHours,
    activeValues,
    workloadData,
    loading,
    error,
    maxVal,
    peakHour,
    hasActivity,
    fetchWorkload,
    TIME_RANGE_OPTIONS,
  }
}