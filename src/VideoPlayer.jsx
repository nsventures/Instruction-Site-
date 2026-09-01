import { useEffect, useRef, useState } from 'react'
import Player from '@vimeo/player'

const fmt = (s) => {
  const t = Math.max(0, Math.floor(s || 0))
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

// controls=0 is the only way to drop Vimeo's logo and Like/Share/Embed chrome
// on a free account, so playback is driven through the Player SDK and the
// controls below are ours. dnt=1 asks Vimeo not to track viewers.
const embed = (id) =>
  `https://player.vimeo.com/video/${id}?controls=0&title=0&byline=0&portrait=0&badge=0&dnt=1&autopause=0&app_id=58479`

// Vimeo shows a "More from ..." end screen of suggested videos when a clip
// finishes, and there is no player param to disable it on a free account.
// Stopping fractionally early means the player never reaches `ended`, so the
// end screen never gets a chance to appear.
const END_GUARD_SECONDS = 0.4

export default function VideoPlayer({ videoId, label }) {
  // React owns the iframe; the SDK only wraps it. Letting the SDK create and
  // destroy the element instead leaves a dead player behind StrictMode's
  // double-mount, and every control silently no-ops.
  const iframeRef = useRef(null)
  const playerRef = useRef(null)
  const stoppingRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!iframeRef.current) return
    const player = new Player(iframeRef.current)
    playerRef.current = player

    const onPlay = () => { stoppingRef.current = false; setPlaying(true) }
    const onPause = () => setPlaying(false)

    // Backstop: if a clip ever does reach the end (a seek to the very end, or
    // a timeupdate gap), rewind immediately so the end screen cannot linger.
    const onEnd = () => {
      setPlaying(false)
      setTime(0)
      player.setCurrentTime(0).catch(() => {})
    }

    const onTime = ({ seconds, duration: total }) => {
      setTime(seconds)
      if (!total || stoppingRef.current) return
      if (seconds >= total - END_GUARD_SECONDS) {
        // Rewind to the start rather than holding the last frame, so the panel
        // returns to our own play affordance.
        stoppingRef.current = true
        player.pause()
          .then(() => player.setCurrentTime(0))
          .then(() => { setPlaying(false); setTime(0) })
          .catch(() => {})
      }
    }

    player.on('play', onPlay)
    player.on('pause', onPause)
    player.on('ended', onEnd)
    player.on('timeupdate', onTime)
    player.getDuration().then(setDuration).catch(() => {})
    player.getMuted().then(setMuted).catch(() => {})

    return () => {
      player.off('play', onPlay)
      player.off('pause', onPause)
      player.off('ended', onEnd)
      player.off('timeupdate', onTime)
      playerRef.current = null
      // No destroy() — React removes the iframe itself on unmount.
    }
  }, [videoId])

  const toggle = () => {
    const p = playerRef.current
    if (!p) return
    p.getPaused()
      .then((paused) => (paused ? p.play() : p.pause()))
      // Autoplay policy can refuse an unmuted start; mute and retry.
      .catch(() => p.setMuted(true).then(() => { setMuted(true); return p.play() }))
      .catch(() => {})
  }

  const toggleMute = () => {
    const p = playerRef.current
    if (!p) return
    p.getMuted().then((m) => p.setMuted(!m).then(() => setMuted(!m))).catch(() => {})
  }

  const seek = (e) => {
    const p = playerRef.current
    if (!p || !duration) return
    const r = e.currentTarget.getBoundingClientRect()
    p.setCurrentTime(((e.clientX - r.left) / r.width) * duration).catch(() => {})
  }

  const fullscreen = () => playerRef.current?.requestFullscreen().catch(() => {})

  const pct = duration ? (time / duration) * 100 : 0

  return (
    <div className={`player${playing ? ' player--playing' : ''}`}>
      <iframe
        key={videoId}
        ref={iframeRef}
        className="player__frame"
        src={embed(videoId)}
        title={`Demo video — ${label}`}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <button
        type="button"
        className="player__surface"
        onClick={toggle}
        aria-label={`${playing ? 'Pause' : 'Play'} demo video — ${label}`}
      >
        {!playing && <span className="player__bigplay" aria-hidden="true" />}
      </button>

      <div className="player__bar">
        <button type="button" className="player__btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          <span className={playing ? 'icon-pause' : 'icon-play'} aria-hidden="true" />
        </button>

        <span className="player__time">{fmt(time)}</span>

        <div
          className="player__track"
          onClick={seek}
          role="progressbar"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
        >
          <span className="player__fill" style={{ width: `${pct}%` }} />
        </div>

        <span className="player__time">{fmt(duration)}</span>

        <button type="button" className="player__btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          <span className={muted ? 'icon-muted' : 'icon-sound'} aria-hidden="true" />
        </button>

        <button type="button" className="player__btn" onClick={fullscreen} aria-label="Fullscreen">
          <span className="icon-full" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
