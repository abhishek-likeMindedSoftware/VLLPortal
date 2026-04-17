export const ROUTES = {
  HOME: '/',
  SELECT_TYPE: '/apply',
  WIZARD: '/apply/:applicationId',
  WIZARD_STEP: '/apply/:applicationId/step/:step',
  STATUS: '/status',
  NOT_FOUND: '*',
} as const
