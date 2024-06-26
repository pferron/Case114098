import ImageResizer, { ResizeFormat, ResizeMode } from "react-native-image-resizer"

interface ResizeImageOptions {
  uri: string
  width: number
  height: number
  outputformat?: ResizeFormat
  quality?: number
  rotation?: number
  outputPath?: string
  keepMeta?: boolean
  onlyScaleDown?: boolean
  mode?: ResizeMode
}

export const resizeImage = (options: ResizeImageOptions) => {
  const {
    uri,
    width,
    height,
    outputformat = "JPEG",
    quality = 100,
    rotation = 0,
    outputPath,
    keepMeta,
    onlyScaleDown,
    mode = "contain",
  } = options

  return ImageResizer.createResizedImage(
    uri,
    width,
    height,
    outputformat,
    quality,
    rotation,
    outputPath,
    keepMeta,
    {
      mode,
      onlyScaleDown,
    }
  )
}

/**
 *
 * Get image accurate square dimensions while keeping the same aspect ratio
 */
export const getImageSquareDimensions = (
  height: number | null | undefined,
  width: number | null | undefined,
  containerHeight: number
) => {
  if (height && width) {
    if (height > width) {
      return {
        height: containerHeight,
        width: (width * containerHeight) / height,
      }
    }
    return {
      height: (height * containerHeight) / width,
      width: containerHeight,
    }
  }
  return {
    height: containerHeight,
    width: containerHeight,
  }
}
