import { isArtworksBasedNotification } from "./isArtworksBasedNotification"

describe("isArtworksBasedNotification", () => {
  it("returns true when notification is artworks based", () => {
    const result = isArtworksBasedNotification("ARTWORK_ALERT")
    expect(result).toEqual(true)

    const result2 = isArtworksBasedNotification("ARTWORK_PUBLISHED")
    expect(result2).toEqual(true)
  })

  it("returns false for all other notification types", () => {
    const result = isArtworksBasedNotification("VIEWING_ROOM_PUBLISHED")
    expect(result).toEqual(false)
  })
})
