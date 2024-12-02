enum VideoTypes {
  YOUTUBE = 1,
  BUNNY = 2,
  NONE = 3,
}

export const VideoTypeDesc: Record<VideoTypes, string> = {
  [VideoTypes.YOUTUBE]: 'YouTube',
  [VideoTypes.BUNNY]: 'Bunny Stream',
  [VideoTypes.NONE]: 'No Video',
}

export default VideoTypes
