import { MyCollectionArtworkFormProps } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { uploadPhotos } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionImageUtil"
import { addArtworkMessages } from "app/Scenes/MyCollection/Screens/ArtworkForm/methods/addArtworkMessages"
import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { deleteArtworkImage } from "app/Scenes/MyCollection/mutations/deleteArtworkImage"
import { myCollectionCreateArtwork } from "app/Scenes/MyCollection/mutations/myCollectionCreateArtwork"
import { myCollectionUpdateArtwork } from "app/Scenes/MyCollection/mutations/myCollectionUpdateArtwork"
import { deletedPhotos } from "app/Scenes/MyCollection/utils/deletedPhotos"
import { storeLocalImage } from "app/utils/LocalImageStore"
import { reverse } from "lodash"

export const updateArtwork = async (
  values: ArtworkFormValues,
  dirtyFormCheckValues: ArtworkFormValues,
  props: MyCollectionArtworkFormProps
) => {
  const {
    photos,
    artistSearchResult,
    customArtist,
    pricePaidDollars,
    pricePaidCurrency,
    artistDisplayName,
    ...others
  } = values

  const newPhotos = photos.filter((photo) => photo.path)
  const externalImageUrls = await uploadPhotos(newPhotos)

  let pricePaidCents
  if (pricePaidDollars && !isNaN(Number(pricePaidDollars))) {
    pricePaidCents = parseFloat(pricePaidDollars) * 100
  }

  if (values.attributionClass !== "LIMITED_EDITION") {
    others.editionNumber = ""
    others.editionSize = ""
  }

  if (props.mode === "add") {
    let artistsData

    if (artistDisplayName) {
      artistsData = [{ displayName: artistDisplayName }]
    } else if (customArtist) {
      artistsData = [{ displayName: customArtist.name }]
    } else artistsData = undefined

    const response = await myCollectionCreateArtwork({
      artistIds: artistSearchResult?.internalID ? [artistSearchResult?.internalID] : undefined,
      artists: artistsData,
      artworkLocation: others.artworkLocation,
      attributionClass: others.attributionClass || undefined,
      category: others.category,
      date: others.date,
      depth: others.depth,
      editionNumber: others.editionNumber,
      editionSize: others.editionSize,
      externalImageUrls,
      height: others.height,
      isEdition: others.isEdition,
      medium: others.medium,
      metric: others.metric,
      confidentialNotes: others.confidentialNotes,
      pricePaidCents,
      pricePaidCurrency,
      provenance: others.provenance,
      title: others.title,
      width: others.width,
    })

    const artwork = response.myCollectionCreateArtwork?.artworkOrError?.artworkEdge?.node

    // Store images locally
    await Promise.all(
      newPhotos.map(async (image, index) => {
        const imageID = artwork?.images?.[index]?.internalID

        if (!imageID) return

        await storeLocalImage(imageID, {
          path: image.path!,
          width: image.width!,
          height: image.height!,
        })
      })
    )

    const hasMarketPriceInsights =
      response.myCollectionCreateArtwork?.artworkOrError?.artworkEdge?.node?.hasMarketPriceInsights

    addArtworkMessages({ hasMarketPriceInsights, sourceTab: props.source })
    return hasMarketPriceInsights
  } else {
    const response = await myCollectionUpdateArtwork({
      artistIds: artistSearchResult?.internalID ? [artistSearchResult?.internalID] : [],
      artworkId: props.artwork.internalID,
      artworkLocation: others.artworkLocation,
      attributionClass: others.attributionClass || undefined,
      category: others.category,
      date: others.date,
      depth: others.depth,
      editionNumber: others.editionNumber,
      editionSize: others.editionSize,
      externalImageUrls,
      height: others.height,
      isEdition: others.isEdition,
      medium: others.medium,
      metric: others.metric,
      confidentialNotes: others.confidentialNotes,
      pricePaidCents: pricePaidCents ?? null,
      pricePaidCurrency,
      provenance: others.provenance,
      title: others.title,
      width: others.width,
    })

    const updatedArtwork = response.myCollectionUpdateArtwork?.artworkOrError?.artwork

    // Store images locally and start from the end because
    // it's only possible to add new images at the end
    const reversedImages = reverse([...(updatedArtwork?.images ?? [])])

    await Promise.all(
      reverse([...newPhotos]).map(async (image, index) => {
        const imageID = reversedImages[index]?.internalID

        if (!imageID) return

        await storeLocalImage(imageID, {
          path: image.path!,
          width: image.width!,
          height: image.height!,
        })
      })
    )

    // Delete images
    const deletedImages = deletedPhotos(dirtyFormCheckValues.photos, photos)
    for (const photo of deletedImages) {
      await deleteArtworkImage(props.artwork.internalID, photo.id)
    }
  }
}
