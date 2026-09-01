// Live machine translation. No dictionary is bundled: strings are sent to a
// translation API on demand and cached in localStorage so each language is
// only ever fetched once per browser.

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', label: 'Urdu', native: 'اردو', rtl: true },
]

export const isRtl = (code) => LANGUAGES.find((l) => l.code === code)?.rtl === true

const CACHE_KEY = 'drone-shoot-translations-v1'

// localStorage is a nice-to-have; a private window or blocked site data must
// not break translation, so every access is guarded.
const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

const writeCache = (cache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* quota or blocked storage — translation still works, just uncached */
  }
}

// Long GET URLs get rejected, so batch the strings into modest chunks.
const CHUNK_CHARS = 1200

const chunk = (strings) => {
  const out = []
  let cur = []
  let size = 0
  for (const s of strings) {
    if (cur.length && size + s.length > CHUNK_CHARS) {
      out.push(cur)
      cur = []
      size = 0
    }
    cur.push(s)
    size += s.length + 1
  }
  if (cur.length) out.push(cur)
  return out
}

// Primary: Google's public translate endpoint. Segments come back split on
// sentence boundaries, so rejoin them and re-split on the newlines we sent.
async function viaGoogle(lines, target) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t&tl=' +
    encodeURIComponent(target) +
    '&q=' +
    encodeURIComponent(lines.join('\n'))

  const res = await fetch(url)
  if (!res.ok) throw new Error(`google ${res.status}`)
  const data = await res.json()
  const joined = (data[0] || []).map((seg) => seg[0]).join('')
  const parts = joined.split('\n')
  if (parts.length !== lines.length) throw new Error('segment mismatch')
  return parts
}

// Fallback: MyMemory, one string per request (it has no batch endpoint).
async function viaMyMemory(lines, target) {
  return Promise.all(
    lines.map(async (line) => {
      const url =
        'https://api.mymemory.translated.net/get?langpair=' +
        encodeURIComponent(`en|${target}`) +
        '&q=' +
        encodeURIComponent(line)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`mymemory ${res.status}`)
      const data = await res.json()
      const out = data?.responseData?.translatedText
      if (!out) throw new Error('mymemory empty')
      return out
    }),
  )
}

/**
 * Translate `strings` into `target`, returning a plain object keyed by the
 * original English. English is returned untouched without any network call.
 */
export async function translateAll(strings, target) {
  if (target === 'en') return Object.fromEntries(strings.map((s) => [s, s]))

  const cache = readCache()
  const forLang = cache[target] || {}
  const missing = [...new Set(strings)].filter((s) => !forLang[s])

  if (missing.length) {
    for (const group of chunk(missing)) {
      let translated
      try {
        translated = await viaGoogle(group, target)
      } catch {
        translated = await viaMyMemory(group, target)
      }
      group.forEach((src, i) => {
        forLang[src] = translated[i]
      })
    }
    cache[target] = forLang
    writeCache(cache)
  }

  return Object.fromEntries(strings.map((s) => [s, forLang[s] || s]))
}
