import { Spacer, Flex, Text, Button } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { Input } from "app/Components/Input"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { ScrollView } from "react-native"

storiesOf("ArtsyKeyboardAvoidingView", module).add("ArtsyKeyboardAvoidingView", () => (
  <ArtsyKeyboardAvoidingView>
    <Flex>
      <ScrollView>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Input title="Email" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Spacer y={4} />
        <Button>"Submit"</Button>
      </ScrollView>
    </Flex>
  </ArtsyKeyboardAvoidingView>
))
