import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend)

export const chartGrid = {
  color: '#F1F0F6',
}

export const chartTicks = {
  color: '#6B7280',
  font: {
    size: 12,
    family: 'Inter, system-ui, sans-serif',
  },
}
