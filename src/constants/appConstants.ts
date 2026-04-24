export const APP_NAME = 'Massachusetts Vehicle Lemon Law'

export const APPLICATION_TYPES = {
  NEW_CAR: 'NEW_CAR',
  USED_CAR: 'USED_CAR',
  LEASED: 'LEASED',
} as const

export const APPLICATION_TYPE_LABELS: Record<string, string> = {
  NEW_CAR: 'New Car Lemon Law',
  USED_CAR: 'Used Car Warranty Law',
  LEASED: 'Leased Vehicle Arbitration',
}

export const WIZARD_STEPS = {
  CONSUMER_INFO: 1,
  VEHICLE_INFO: 2,
  DEFECTS_REPAIRS: 3,
  NARRATIVE: 4,
  DOCUMENTS: 5,
  REVIEW_SUBMIT: 6,
} as const

export const WIZARD_STEP_LABELS: Record<number, string> = {
  1: 'Your Information',
  2: 'Vehicle Information',
  3: 'Defects & Repairs',
  4: 'Your Statement',
  5: 'Documents',
  6: 'Review & Submit',
}

export const TOKEN_STORAGE_KEY = 'vll_access_token'
export const APPLICATION_ID_KEY = 'vll_application_id'
export const CASE_NUMBER_KEY = 'vll_case_number'
