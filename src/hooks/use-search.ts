import type { SearchProvider } from '@/lib/settings';
import { useSettings } from '@/lib/useSettings';
import { useState } from 'react';

const SEARCH_ENGINE_URL: Record<SearchProvider, string> = {
  "google": "https://www.google.com/?q=",
  "bing": "https://www.bing.com/search?q=",
  "gogoduck": "https://duckduckgo.com/?q=",
  "brave": "https://search.brave.com/search?q="
}

export function useSearch() {
  const [term, setTerm] = useState('')

  const { settings } = useSettings()

  const onChange = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(currentTarget.value)
  }

  const onKeyPress = (e: React.KeyboardEvent) => {
    const { searchProvider } = settings;

    if (e.key === 'Enter') {
      window.location.href = `${SEARCH_ENGINE_URL[searchProvider]}${term}`
    }
  }

  return { term, onChange, onKeyPress }
}
