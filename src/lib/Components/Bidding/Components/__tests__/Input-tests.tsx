import React from "react"
import { TextInput } from "react-native"
import ReactTestRenderer from "react-test-renderer"

import { theme } from "../../Elements/Theme"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Input } from "../Input"

/* tslint:disable use-wrapped-components */

it("shows a gray border by default", () => {
  const component = ReactTestRenderer.create(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  // @ts-ignore STRICTNESS_MIGRATION
  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("shows a purple border on focus", () => {
  const component = ReactTestRenderer.create(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  const inputComponent = component.root.findByType(Input).instance

  inputComponent.onFocus()

  // @ts-ignore STRICTNESS_MIGRATION
  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.purple100)
})

it("changes the border color back to gray on blur", () => {
  const component = ReactTestRenderer.create(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  const inputComponent = component.root.findByType(Input).instance

  inputComponent.onFocus()
  inputComponent.onBlur()

  // @ts-ignore STRICTNESS_MIGRATION
  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("shows a red border if error is true", () => {
  const component = ReactTestRenderer.create(
    <BiddingThemeProvider>
      <Input error />
    </BiddingThemeProvider>
  )

  // @ts-ignore STRICTNESS_MIGRATION
  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.red100)
})

it("updates the border color when the parent component updates the error prop", () => {
  class TestFormForInput extends React.Component {
    state = { error: false }

    render() {
      return (
        <BiddingThemeProvider>
          <Input error={this.state.error} />
        </BiddingThemeProvider>
      )
    }
  }

  const component = ReactTestRenderer.create(<TestFormForInput />)

  // @ts-ignore STRICTNESS_MIGRATION
  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)

  // Explicitly calling setState to force-render the Input component
  component.root.instance.setState({ error: true })

  // @ts-ignore STRICTNESS_MIGRATION
  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.red100)

  component.root.instance.setState({ error: false })

  // @ts-ignore STRICTNESS_MIGRATION
  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("allows for capturing the ref to the actual text input", () => {
  // FXIME: This is a StyledNativeComponent instance. Find the appropriate type and replace any with it.
  let inputRef: any

  const component = ReactTestRenderer.create(
    <BiddingThemeProvider>
      <Input inputRef={element => (inputRef = element)} />
    </BiddingThemeProvider>
  )

  const actualTextInput = component.root.findByType(Input).findByType(TextInput).instance

  expect(inputRef).toBe(actualTextInput)
})
