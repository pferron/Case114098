import { fireEvent } from "@testing-library/react-native"
import { OAuthProvider } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Platform } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { OnboardingNavigationStack } from "./Onboarding"
import { OnboardingSocialLink } from "./OnboardingSocialLink"

describe("OnboardingSocialLink", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const navigationMock = {
    addListener: jest.fn(),
    navigate: jest.fn(),
  }
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const defaultParams = {
    email: "email@mail.com",
    name: "my Name",
    tokenForProviderToBeLinked: "oauthtoken",
    providers: ["email", "google", "apple"] as OAuthProvider[],
    providerToBeLinked: "facebook" as OAuthProvider,
  }

  const getWrapper = (routeParams?: OnboardingNavigationStack["OnboardingSocialLink"]) => {
    return renderWithWrappers(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <SafeAreaProvider initialSafeAreaInsets={{ top: 1, left: 2, right: 3, bottom: 4 }}>
          <OnboardingSocialLink
            navigation={navigationMock as any}
            route={{ params: { ...defaultParams, ...routeParams } } as any}
          />
        </SafeAreaProvider>
      </RelayEnvironmentProvider>
    )
  }

  describe("Link Account Buttons", () => {
    it("Google Link Account Button logs in With Google and passes onSignIn callback", () => {
      const spy = jest.spyOn(GlobalStore.actions.auth, "authGoogle")
      const params = { ...defaultParams, providers: ["email", "google"] as OAuthProvider[] }
      const tree = getWrapper(params)

      const linkWithGoogle = tree.getByTestId("linkWithGoogle")
      fireEvent.press(linkWithGoogle)
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          signInOrUp: "signIn",
          onSignIn: expect.any(Function),
        })
      )
    })

    it("Apple Link Account Button logs in With Apple and passes onSignIn callback", () => {
      Platform.OS = "ios"
      Object.defineProperty(Platform, "Version", {
        get: () => 14,
      })

      const spy = jest.spyOn(GlobalStore.actions.auth, "authApple")
      const params = {
        ...defaultParams,
        providers: ["email", "apple"] as OAuthProvider[],
        tokenforProviderToBeLinked: {
          idToken: "idToken",
          appleUid: "appleUid",
        },
      }
      const tree = getWrapper(params)

      const linkWithApple = tree.getByTestId("linkWithApple")
      fireEvent.press(linkWithApple)
      expect(spy).toBeCalledWith({
        onSignIn: expect.any(Function),
      })
    })

    it("Facebook Link Account Button logs in With Facebook and passes onSignIn callback", () => {
      const spy = jest.spyOn(GlobalStore.actions.auth, "authFacebook")
      const params = {
        ...defaultParams,
        providers: ["email", "facebook"] as OAuthProvider[],
        providerToBeLinked: "google" as OAuthProvider,
      }
      const tree = getWrapper(params)

      const linkWithFacebook = tree.getByTestId("linkWithFacebook")
      fireEvent.press(linkWithFacebook)
      expect(spy).toBeCalledWith({
        signInOrUp: "signIn",
        onSignIn: expect.any(Function),
      })
    })

    it("Email Link Account Button switches screen to show only password form", () => {
      const tree = getWrapper()
      expect(() => tree.getByTestId("artsySocialLinkPasswordInput")).toThrowError(
        "Unable to find an element with testID: artsySocialLinkPasswordInput"
      )
      const linkWithEmail = tree.getByTestId("linkWithEmail")
      fireEvent.press(linkWithEmail)
      expect(tree.getByTestId("artsySocialLinkPasswordInput")).toBeDefined()
    })
  })
})
