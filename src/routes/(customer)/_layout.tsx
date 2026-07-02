import { createFileRoute } from '@tanstack/react-router'
import CustomerLayout from '@/components/customer/CustomerLayout'

export const Route = createFileRoute('/(customer)/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CustomerLayout />
}
