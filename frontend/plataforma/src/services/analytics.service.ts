import { apiService } from '../lib/api'

export interface AnalyticsFilter {
  fecha_inicio: string
  fecha_fin: string
}

export interface WorkloadDataPoint {
  hour: string
  count: number
}

export interface AnalyticsResponse {
  orders: any[]
  workload: WorkloadDataPoint[]
}

export const analyticsService = {
  async getWorkload(filter: AnalyticsFilter): Promise<WorkloadDataPoint[]> {
    const res = await apiService.get('/orders', {
      params: {
        fecha_inicio: filter.fecha_inicio,
        fecha_fin: filter.fecha_fin
      }
    })
    const orders = res?.orders || []
    return computeWorkload(orders)
  }
}

function computeWorkload(orders: any[]): WorkloadDataPoint[] {
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
  const counts = new Array(hours.length).fill(0)

  orders.forEach((order: any) => {
    const hour = new Date(order.fecha_creacion).getHours()
    const index = Math.floor(hour / 2) - 3
    if (index >= 0 && index < counts.length) counts[index]++
  })

  return hours.map((hour, i) => ({ hour, count: counts[i] }))
}