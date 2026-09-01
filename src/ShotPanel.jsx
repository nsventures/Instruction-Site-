import VideoPlayer from './VideoPlayer'

export default function ShotPanel({ label, brief, videoId }) {
  return (
    <div className="panel">
      <div className="panel__copy">
        <h2 className="panel__title">{label}</h2>
        <p className="panel__brief">{brief}</p>
      </div>

      {videoId ? (
        <VideoPlayer videoId={videoId} label={label} />
      ) : (
        <div className="video--empty" role="img" aria-label={`Demo video for ${label} — not yet added`}>
          <span className="video__caption">VIEW DEMO VIDEO</span>
          <span className="video__play" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
