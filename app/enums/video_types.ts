enum VideoTypes {
  YOUTUBE = 1,
  BUNNY = 2,
}

export const VideoTypeDesc: Record<VideoTypes, string> = {
  [VideoTypes.YOUTUBE]: 'YouTube',
  [VideoTypes.BUNNY]: 'Bunny Stream',
}

export default VideoTypes
