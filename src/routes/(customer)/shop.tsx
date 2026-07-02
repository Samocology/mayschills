import { createFileRoute } from '@tanstack/react-router'
import Shop from '@/pages/Shop'

export const Route = createFileRoute('/(customer)/shop')({
  component: Shop,
})
