// Content extracted from "Drone shoot Demo video.pdf".
//
// Every shot carries a `video` field. Drop in a URL (mp4, or a YouTube/Vimeo
// embed link) and the player renders it; leave it null and the panel shows the
// "VIEW DEMO VIDEO" placeholder from the deck.

const DEFAULT_BRIEF =
  'Capture a smooth cinematic drone shot. Start with a wide establishing view, ' +
  'then slowly fly forward and upward while keeping the main subject centered. ' +
  'Maintain stable movement, avoid sudden turns, and capture the surrounding ' +
  'landscape for a cinematic reveal. Record in high resolution with smooth, ' +
  'slow camera movements.'

export const title = 'CONNECTIVITY VIDEO DRONE SHOOT'

export const sections = [
  {
    id: 'route-shoot',
    label: 'ROUTE SHOOT',
    brief: DEFAULT_BRIEF,
    video: null,
  },
  {
    id: 'turning-point',
    label: 'TURNING POINT',
    brief: DEFAULT_BRIEF,
    video: null,
  },
  {
    id: 'site-shots',
    label: 'SITE SHOTS',
    // Nested tabs: the seven shots listed under SITE SHOTS in the deck.
    shots: [
      { id: 'site-approaching', label: 'Site Approaching shot', brief: DEFAULT_BRIEF, video: null },
      { id: 'project-entrance', label: 'Project Entrance Shot', brief: DEFAULT_BRIEF, video: null },
      { id: 'top-angle-zoom-in', label: 'Top Angle Zoom IN', brief: DEFAULT_BRIEF, video: null },
      { id: 'top-angle-zoom-out', label: 'Top Angle Zoom Out', brief: DEFAULT_BRIEF, video: null },
      { id: 'top-angle-orbital', label: 'Top Angle Orbital with zoom IN or Out', brief: DEFAULT_BRIEF, video: null },
      { id: 'site-revolving', label: 'Site Revolving shot', brief: DEFAULT_BRIEF, video: null },
      { id: 'pull-back', label: 'Pull Back shot from site', brief: DEFAULT_BRIEF, video: null },
    ],
  },
]
