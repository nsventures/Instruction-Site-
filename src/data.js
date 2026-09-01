// Content extracted from "Drone shoot Demo video.pdf", with Vimeo demo videos.
//
// `videoId` is the bare Vimeo id. The player is constructed by the Vimeo SDK in
// VideoPlayer.jsx with Vimeo's own controls disabled, so no Vimeo branding is
// rendered; the controls you see are ours.


export const title = 'CONNECTIVITY VIDEO DRONE SHOOT'

export const sections = [
  {
    id: 'route-shoot',
    label: 'ROUTE SHOOT',
    brief:
      'Follow the approach road into the project with one continuous, ' +
      'unbroken pass. Open on a wide establishing frame, then track forward ' +
      'along the route at a steady altitude, keeping the carriageway running ' +
      'through the centre of frame. Hold a constant speed so the surrounding ' +
      'context reads clearly, and let the destination reveal itself at the ' +
      'end of the move rather than cutting to it.',
    videoId: '1222994580',
  },
  {
    id: 'turning-point',
    label: 'TURNING POINT',
    brief:
      'Mark the junction where the approach route meets the site. Begin ' +
      'square to the turning, then arc smoothly through the bend while ' +
      'holding the intersection at the centre of frame. Keep the yaw slow ' +
      'and even so the change of direction reads as one deliberate movement, ' +
      'and carry enough of the surrounding roads to make the turn legible.',
    videoId: '1222994537',
  },
  {
    id: 'site-shots',
    label: 'SITE SHOTS',
    // Nested tabs: the seven shots listed under SITE SHOTS in the deck.
    shots: [
      {
        id: 'site-approaching',
        label: 'Site Approaching shot',
        brief:
          'Fly in toward the site from a distance at a low, steady altitude. ' +
          'Start wide enough to place the project in its surroundings, then ' +
          'close the gap gradually while keeping the main structure centred. ' +
          'Maintain stable forward motion throughout — the shot should feel ' +
          'like a calm arrival, not a rush.',
        videoId: '1222994536',
      },
      {
        id: 'project-entrance',
        label: 'Project Entrance Shot',
        brief:
          'Frame the entrance gate and approach as the hero of the shot. ' +
          'Move slowly through or over the threshold, holding the signage and ' +
          'gateway structure in clear view long enough to be read. Keep the ' +
          'horizon level and the movement gentle so the branding and entry ' +
          'detail stay sharp.',
        videoId: '1222994538',
      },
      {
        id: 'top-angle-zoom-in',
        label: 'Top Angle Zoom IN',
        brief:
          'Begin high above the site with the full plot in frame, then ' +
          'descend steadily toward a single focal point. Keep the camera ' +
          'pointed straight down and the descent even, so layout and massing ' +
          'resolve into detail without any drift or correction mid-move.',
        videoId: '1222994533',
      },
      {
        id: 'top-angle-zoom-out',
        label: 'Top Angle Zoom Out',
        brief:
          'The reverse reveal. Open tight on a specific feature from directly ' +
          'overhead, then rise smoothly to expose the wider site and its ' +
          'context. Hold the same centre point throughout the climb so the ' +
          'surrounding development opens outward symmetrically.',
        videoId: '1222992694',
      },
      {
        id: 'top-angle-orbital',
        label: 'Top Angle Orbital with zoom IN or Out',
        brief:
          'Circle the site from a high angle while simultaneously gaining or ' +
          'losing altitude. Lock the orbit to a fixed centre point and keep ' +
          'the radius consistent, letting the change in height do the work. ' +
          'The combined move should feel like a single sweep, with no visible ' +
          'hesitation where the orbit and the climb meet.',
        videoId: '1222992692',
      },
      {
        id: 'site-revolving',
        label: 'Site Revolving shot',
        brief:
          'A full rotation around the project at a mid altitude. Hold the ' +
          'main structure locked at the centre of frame for the entire ' +
          'revolution, keeping speed and distance constant so every elevation ' +
          'gets equal screen time and the light shifts naturally across the ' +
          'faces as you come around.',
        videoId: '1222992693',
      },
      {
        id: 'pull-back',
        label: 'Pull Back shot from site',
        brief:
          'Close on the site and retreat. Start tight on the primary ' +
          'structure, then fly backward and upward in one continuous motion ' +
          'to reveal the full development and the landscape beyond it. Keep ' +
          'the subject anchored in frame as it recedes — this is the closing ' +
          'shot, so let it breathe and hold the final wide.',
        videoId: '1222994584',
      },
    ],
  },
]
