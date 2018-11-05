import { TextInput, Platform } from 'react-native'
import React from 'react'

import { Flex } from '.'
import { colors } from '../../constants'
import { paddingBottom, paddingLeft, paddingRight } from '../../styles'

const SearchBar = props => (
  <Flex.Cols size={1} style={[paddingBottom]}>
    <TextInput
      underlineColorAndroid='transparent'
      autoCorrect={
        (props.autoCorrect !== undefined && props.autoCorrect) || false
      }
      style={[
        ...(props.style || []),
        {
          height: 36,
          flex: 1,
          backgroundColor: colors.grey7,
          borderWidth: 0,
          borderRadius: 18,
          ...(Platform.OS === 'web' ? { outline: 'none' } : {}),
        },
        paddingLeft,
        paddingRight,
      ]}
      placeholder={
        props.placeholder !== undefined ? props.placeholder : 'Search...'
      }
      onChangeText={props.onChangeText}
    />
    {props.children}
  </Flex.Cols>
)

export default SearchBar
