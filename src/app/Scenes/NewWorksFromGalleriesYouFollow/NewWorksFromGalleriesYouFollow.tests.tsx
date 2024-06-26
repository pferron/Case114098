import { NewWorksFromGalleriesYouFollowTestsQuery } from "__generated__/NewWorksFromGalleriesYouFollowTestsQuery.graphql"
import { NewWorksFromGalleriesYouFollow } from "app/Scenes/NewWorksFromGalleriesYouFollow/NewWorksFromGalleriesYouFollow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Suspense } from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("NewWorksFromGalleriesYouFollow", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<NewWorksFromGalleriesYouFollowTestsQuery>
      query={graphql`
        query NewWorksFromGalleriesYouFollowTestsQuery {
          me {
            ...NewWorksFromGalleriesYouFollow_artworksConnection @arguments(count: 10)
          }
        }
      `}
      render={() => {
        return (
          <Suspense fallback={null}>
            <NewWorksFromGalleriesYouFollow />
          </Suspense>
        )
      }}
      variables={{}}
      environment={mockEnvironment}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders NewWorksFromGalleriesYouFollow", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => mockResponse,
      })
    )

    expect(tree.findByText("New Works from Galleries You Follow")).toBeTruthy()
    expect(tree.findByText("Sunflower Seeds Exhibition")).toBeTruthy()
    expect(
      tree.findByText("JEAN-MICHEL BASQUIAT- HOLLYWOOD AFRICANS TRIPTYCH SKATE DECKS")
    ).toBeTruthy()
  })
})

const mockResponse = {
  me: {
    newWorksFromGalleriesYouFollowArtworksConnection: {
      edges: [
        {
          node: {
            slug: "ai-weiwei-sunflower-seeds-exhibition",
            id: "QXJ0d29yazo2MTNhMzhkNjYxMTI5NzAwMGQ3Y2NjMWQ=",
            image: {
              aspectRatio: 1.27,
              url: "https://d32dm0rphc51dk.cloudfront.net/ZRMpZo7ikbEdx3yqBNlDVA/large.jpg",
            },
            title: "Sunflower Seeds Exhibition",
            date: "2010",
            saleMessage: "US$1,750",
            internalID: "613a38d6611297000d7ccc1d",
            artistNames: "Ai Weiwei",
            href: "/artwork/ai-weiwei-sunflower-seeds-exhibition",
            sale: null,
            saleArtwork: null,
            partner: {
              name: "West Chelsea Contemporary",
            },
          },
        },
        {
          node: {
            slug: "jean-michel-basquiat-jean-michel-basquiat-hollywood-africans-triptych-skate-decks-1",
            id: "QXJ0d29yazo2MTRlNDAwNmY4NTZhMDAwMGRmMTM5OWM=",
            image: {
              aspectRatio: 1,
              url: "https://d32dm0rphc51dk.cloudfront.net/fQkbGHRoxplWPRcIpGeAXw/large.jpg",
            },
            title: "JEAN-MICHEL BASQUIAT- HOLLYWOOD AFRICANS TRIPTYCH SKATE DECKS",
            date: "ca. 2014",
            saleMessage: "£1,095",
            internalID: "614e4006f856a0000df1399c",
            artistNames: "Jean-Michel Basquiat",
            href: "/artwork/jean-michel-basquiat-jean-michel-basquiat-hollywood-africans-triptych-skate-decks-1",
            sale: null,
            saleArtwork: null,
            partner: {
              name: "Arts Limited",
            },
          },
        },
      ],
    },
  },
}
