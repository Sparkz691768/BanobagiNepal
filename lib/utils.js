export function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-NP')}`
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
}

export const PAYMENT_STATUS_COLORS = {
  unpaid: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
}
