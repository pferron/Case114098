import { OwnerType } from "@artsy/cohesion"
import { Tabs } from "@artsy/palette-mobile"
import { ArtistInsights_artist$data } from "__generated__/ArtistInsights_artist.graphql"
import { ARTIST_HEADER_HEIGHT } from "app/Components/Artist/ArtistHeader"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { SCROLL_UP_TO_SHOW_THRESHOLD } from "app/utils/hideBackButtonOnScroll"
import { Schema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"
import { MarketStatsQueryRenderer } from "./MarketStats"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist$data
  relay: RelayProp
  initialFilters?: FilterArray
}

const FILTER_BUTTON_OFFSET = 50
export const ArtistInsights: React.FC<ArtistInsightsProps> = (props) => {
  const { artist, relay, initialFilters } = props

  const tracking = useTracking()

  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const auctionResultsYCoordinate = useRef<number>(0)
  const contentYScrollOffset = useRef<number>(0)

  const openFilterModal = () => {
    tracking.trackEvent(tracks.openFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    tracking.trackEvent(tracks.closeFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(false)
  }

  const scrollToTop = useCallback(() => {
    let auctionResultYOffset = auctionResultsYCoordinate.current

    // if we scroll up less than SCROLL_UP_TO_SHOW_THRESHOLD the header won't expand and we need another offset
    if (contentYScrollOffset.current - 2 * auctionResultYOffset <= SCROLL_UP_TO_SHOW_THRESHOLD) {
      auctionResultYOffset += ARTIST_HEADER_HEIGHT
    }
  }, [auctionResultsYCoordinate, contentYScrollOffset])

  // Show or hide floating filter button depending on the scroll position
  const onScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentYScrollOffset.current = event.nativeEvent.contentOffset.y

    if (event.nativeEvent.contentOffset.y > FILTER_BUTTON_OFFSET) {
      setIsFilterButtonVisible(true)
      return
    }
    setIsFilterButtonVisible(false)
  }, [])

  const focusedTab = useFocusedTab()

  useEffect(() => {
    if (focusedTab === "Insights") {
      tracking.trackEvent(tracks.screen(artist.internalID, artist.slug))
    }
  }, [focusedTab])

  return (
    <ArtworkFiltersStoreProvider>
      <Tabs.ScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 60, paddingHorizontal: 20 }}
        onScrollEndDrag={onScrollEndDrag}
      >
        <MarketStatsQueryRenderer
          artistInternalID={artist.internalID}
          environment={relay.environment}
        />
        <View
          onLayout={({
            nativeEvent: {
              layout: { y },
            },
          }) => {
            auctionResultsYCoordinate.current = y
          }}
        >
          <ArtistInsightsAuctionResultsPaginationContainer
            artist={artist}
            scrollToTop={scrollToTop}
            initialFilters={initialFilters}
          />
        </View>
      </Tabs.ScrollView>

      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        id={artist.internalID}
        slug={artist.slug}
        mode={FilterModalMode.AuctionResults}
        exitModal={closeFilterModal}
        closeModal={closeFilterModal}
        title="Filter auction results"
      />
      <AnimatedArtworkFilterButton
        isVisible={isFilterButtonVisible}
        onPress={openFilterModal}
        text="Filter auction results"
      />
    </ArtworkFiltersStoreProvider>
  )
}

export const ArtistInsightsFragmentContainer = createFragmentContainer(ArtistInsights, {
  artist: graphql`
    fragment ArtistInsights_artist on Artist {
      name
      id
      internalID
      slug
      ...ArtistInsightsAuctionResults_artist
    }
  `,
})

export const tracks = {
  openFilter: (id: string, slug: string) => {
    return {
      action_name: "filter",
      context_screen_owner_type: OwnerType.artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
  closeFilter: (id: string, slug: string) => {
    return {
      action_name: "closeFilterWindow",
      context_screen_owner_type: OwnerType.artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
  screen: (id: string, slug: string) =>
    screen({
      context_screen_owner_type: OwnerType.artistAuctionResults,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
    }),
}
