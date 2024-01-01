// the v2 config imports the css driver on web and react-native on native
// for reanimated: @tamagui/config/v2-reanimated
// for react-native only: @tamagui/config/v2-native

import { config } from '@tamagui/config/v2-native'

import { createTamagui } from 'tamagui'
const tamaguiConfig = createTamagui(config)

type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig