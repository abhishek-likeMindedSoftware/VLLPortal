const Config = {
  API_URL: import.meta.env.VITE_API_URL ?? '',
  GOOGLE_PLACES_KEY: import.meta.env.VITE_GOOGLE_PLACES_KEY ?? '',
  ENV: import.meta.env.MODE,
}

export default Config
