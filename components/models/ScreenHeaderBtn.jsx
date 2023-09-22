import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'

import { COLORS, SIZES } from '../../constants'

const ScreenHeaderBtn = ({ iconUrl, dimension }) => {
  return (
    <TouchableOpacity style={styles.btnContainer}>
      <Image
        source={iconUrl}
        resizeMode='contain'
        style={styles.btnImg(dimension)}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    btnContainer: {
      width: 150,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
    },
    btnImg: (dimension) => ({
      width: dimension,
      height: dimension,
      borderRadius: SIZES.small / 1.25,
    }),
  });

export default ScreenHeaderBtn