import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ImageCarouselContext, useNewImageCarouselContext } from "./ImageCarouselContext"
import { ImageCarouselEmbedded } from "./ImageCarouselEmbedded"

const contextMock: Parameters<typeof useNewImageCarouselContext>[0] = {
  images: [
    {
      internalID: "123",
      height: 5,
      width: 5,
      url: "a",
      largeImageURL: "a",
      resized: {
        src: "a",
      },
      deepZoom: {
        image: { url: "", format: "", tileSize: 300, size: { width: 302, height: 302 } },
      },
    },
    {
      internalID: "1234",
      height: 5,
      width: 5,
      url: "b",
      largeImageURL: "b",
      resized: {
        src: "b",
      },
      deepZoom: {
        image: { url: "", format: "", tileSize: 300, size: { width: 302, height: 302 } },
      },
    },
  ],
}

type ContextInit = typeof contextMock

interface WrapperProps {
  contextInit?: ContextInit
}

describe("ImageCarouselEmbedded", () => {
  let context: ImageCarouselContext
  const onImagePressedMock = jest.fn()

  const TestWrapper = ({ contextInit = contextMock }: WrapperProps) => {
    const value = useNewImageCarouselContext(contextInit)
    context = value

    return (
      <ImageCarouselContext.Provider value={value}>
        <ImageCarouselEmbedded cardHeight={275} onImagePressed={onImagePressedMock} />
      </ImageCarouselContext.Provider>
    )
  }

  it("should render all passed images", () => {
    const { getAllByLabelText } = renderWithWrappers(<TestWrapper />)

    expect(getAllByLabelText("Image with Loading State")).toHaveLength(2)
  })

  it("responds to onImagePressed prop", () => {
    const { getAllByLabelText } = renderWithWrappers(<TestWrapper />)

    fireEvent.press(getAllByLabelText("Image with Loading State")[0])
    expect(onImagePressedMock).toHaveBeenCalled()
  })

  it("does something when you tap an image with deepZoom", () => {
    const { getAllByLabelText } = renderWithWrappers(<TestWrapper />)

    expect(context.fullScreenState.current).toBe("none")

    fireEvent.press(getAllByLabelText("Image with Loading State")[0])
    expect(context.fullScreenState.current).not.toBe("none")
  })

  it("does nothing when you tap an image without deepZoom", () => {
    const contextInit: ContextInit = {
      images: [
        {
          internalID: "123",
          deepZoom: null,
          height: 302,
          url: "https://example.com/image.jpg",
          largeImageURL: "https://example.com/image.jpg",
          resized: {
            src: "https://example.com/image.jpg",
          },
          width: 40,
        },
      ],
    }

    const { getAllByLabelText } = renderWithWrappers(<TestWrapper contextInit={contextInit} />)

    expect(context.fullScreenState.current).toBe("none")

    fireEvent.press(getAllByLabelText("Image with Loading State")[0])
    expect(context.fullScreenState.current).toBe("none")
  })
})
