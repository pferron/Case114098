import { ArtistInsightsTestsQuery } from "__generated__/ArtistInsightsTestsQuery.graphql"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistInsightsFragmentContainer } from "./ArtistInsights"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"

jest.mock("react-native-collapsible-tab-view", () => {
  const getMockCollapsibleTabs =
    require("app/utils/tests/getMockCollapsibleTabView").getMockCollapsibleTabs
  return {
    ...getMockCollapsibleTabs(),
    useFocusedTab: () => "Insights",
  }
})

const trackEvent = useTracking().trackEvent

describe("ArtistInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<ArtistInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistInsightsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsights_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props?.artist) {
          return null
        }
        return <ArtistInsightsFragmentContainer artist={props.artist} />
      }}
    />
  )

  it("renders list auction results", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment)
    expect(tree.findAllByType(ArtistInsightsAuctionResultsPaginationContainer).length).toEqual(1)
  })

  it("tracks an auction page view when artist insights is current tab", async () => {
    renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment)

    await flushPromiseQueue()

    expect(trackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_id: "internalID-1",
      context_screen_owner_slug: "slug-1",
      context_screen_owner_type: "artistAuctionResults",
    })
  })
})
