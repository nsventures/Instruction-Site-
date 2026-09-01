function VideoFrame({ src, label }) {
  if (!src) {
    return (
      <div className="video video--empty" role="img" aria-label={`Demo video for ${label} — not yet added`}>
        <span className="video__caption">VIEW DEMO VIDEO</span>
        <span className="video__play" aria-hidden="true" />
      </div>
    )
  }

  // Embed links (YouTube/Vimeo) need an iframe; anything else is treated as a file.
  const isEmbed = /youtube\.com\/embed|player\.vimeo\.com/.test(src)

  return isEmbed ? (
    <iframe
      className="video"
      src={src}
      title={`Demo video — ${label}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  ) : (
    <video className="video" src={src} controls preload="metadata" />
  )
}

export default function ShotPanel({ label, brief, video }) {
  return (
    <div className="panel">
      <div className="panel__copy">
        <h2 className="panel__title">{label}</h2>
        <p className="panel__brief">{brief}</p>
      </div>
      <VideoFrame src={video} label={label} />
    </div>
  )
}
