enum VideoTypes {
  YOUTUBE = 1,
  BUNNY = 2,
  NONE = 3,
  R2 = 4,
}

export const VideoTypesOrdered: VideoTypes[] = [
  VideoTypes.YOUTUBE,
  VideoTypes.BUNNY,
  VideoTypes.R2,
  VideoTypes.NONE,
]

export const VideoTypeDesc: Record<VideoTypes, string> = {
  [VideoTypes.YOUTUBE]: 'YouTube',
  [VideoTypes.BUNNY]: 'Bunny Stream',
  [VideoTypes.NONE]: 'No Video',
  [VideoTypes.R2]: 'Cloudflare R2',
}

export default VideoTypes
