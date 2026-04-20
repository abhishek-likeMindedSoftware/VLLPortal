import { useRef, useEffect } from 'react'
import Config from '@/config'

export interface PlaceAddress {
  addressLine1: string
  city: string
  state: string
  zipCode: string
  placeId: string
}

interface Props {
  id: string
  value: string
  onChange: (value: string) => void
  onPlaceSelected: (address: PlaceAddress) => void
  placeholder?: string
  className?: string
  error?: boolean
  'aria-describedby'?: string
}

// Load the Google Maps script once globally
let scriptLoaded = false
let scriptLoading = false
const callbacks: Array<() => void> = []

function loadGoogleMapsScript(apiKey: string, onLoad: () => void) {
  if (scriptLoaded) { onLoad(); return }
  callbacks.push(onLoad)
  if (scriptLoading) return
  scriptLoading = true

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = () => {
    scriptLoaded = true
    callbacks.forEach(cb => cb())
    callbacks.length = 0
  }
  document.head.appendChild(script)
}

export default function AddressAutocomplete({
  id, value, onChange, onPlaceSelected,
  placeholder = 'Start typing an address…',
  className = 'vll-input',
  error,
  'aria-describedby': ariaDescribedBy,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    const apiKey = Config.GOOGLE_PLACES_KEY
    if (!apiKey) return

    loadGoogleMapsScript(apiKey, () => {
      if (!inputRef.current || autocompleteRef.current) return

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address', 'place_id'],
        }
      )

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current!.getPlace()
        if (!place.address_components) return

        let streetNumber = ''
        let route = ''
        let city = ''
        let state = ''
        let zip = ''

        for (const component of place.address_components) {
          const types = component.types
          if (types.includes('street_number')) streetNumber = component.long_name
          else if (types.includes('route')) route = component.long_name
          else if (types.includes('locality')) city = component.long_name
          else if (types.includes('administrative_area_level_1')) state = component.short_name
          else if (types.includes('postal_code')) zip = component.long_name
        }

        const addressLine1 = [streetNumber, route].filter(Boolean).join(' ')
        onChange(addressLine1)
        onPlaceSelected({
          addressLine1,
          city,
          state,
          zipCode: zip,
          placeId: place.place_id ?? '',
        })
      })
    })

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${className}${error ? ' error' : ''}`}
      aria-describedby={ariaDescribedBy}
      autoComplete="off"
    />
  )
}
