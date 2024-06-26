import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { MyCollectionBottomSheetModalArtistPreviewQueryRenderer } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPrevie"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useCallback, useMemo, useRef } from "react"

export type MyCollectionBottomSheetModalKind = "Add" | "Artist" | null

export const MyCollectionBottomSheetModals: React.FC<{}> = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)
  const view = MyCollectionTabsStore.useStoreState((state) => state.viewKind)
  const id = MyCollectionTabsStore.useStoreState((state) => state.id)
  const uploadsCount = MyCollectionTabsStore.useStoreState((state) => state.artworksCount)

  const snapPoints = useMemo(() => [view === "Artist" ? 410 : 370], [])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setViewKind({ viewKind: null })
    }
  }, [])

  const hideBottomSheet = () => {
    if (view) {
      bottomSheetRef.current?.close()
      setViewKind({ viewKind: null })
    }
  }

  const renderBackdrop: BottomSheetProps["backdropComponent"] = (props) => {
    return <DefaultBottomSheetBackdrop pressBehavior="close" onClose={hideBottomSheet} {...props} />
  }

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "black", width: 40, height: 4, borderRadius: 2 }}
      >
        {view === "Add" && <MyCollectionBottomSheetModalAdd />}
        {view === "Artist" && !!id && (
          <MyCollectionBottomSheetModalArtistPreviewQueryRenderer
            artistID={id}
            uploadsCount={uploadsCount}
          />
        )}
      </BottomSheet>
    </>
  )
}
