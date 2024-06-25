export const baseUrl =
  import.meta.env.VITE_ENV == 'development'
    ? import.meta.env.VITE_DEV_API_URL
    : import.meta.env.VITE_API_URL
export const timezone = 'Asia/Bangkok'

export const billStatuses = [
  {
    value: 'new_request',
    text: 'New Request',
    default: false,
  },
  {
    value: 'pending',
    text: 'Pending',
    default: true,
  },
  {
    value: 'in_progress',
    text: 'In Progress',
    default: false,
  },
  {
    value: 'completed',
    text: 'Completed',
    default: false,
  },
  {
    value: 'closed',
    text: 'Closed',
    default: false,
  },
  {
    value: 'canceled',
    text: 'Canceled',
    default: false,
  },
  {
    value: 'void',
    text: 'Void',
    default: false,
  },
]
export const jobStatuses = [
  {
    value: 'pending',
    text: 'Pending',
    default: true,
  },
  {
    value: 'dispatched',
    text: 'Dispatched',
    default: false,
  },
  {
    value: 'running',
    text: 'Running',
    default: false,
  },
  {
    value: 'held',
    text: 'Held',
    default: false,
  },
  {
    value: 'completed',
    text: 'Completed',
    default: false,
  },
  {
    value: 'canceled',
    text: 'Canceled',
    default: false,
  },
]
