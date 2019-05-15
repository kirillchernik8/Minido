import React from 'react'
import {StyleSheet, View, Text } from 'react-native';

const Subtitle = ({subtitle})=>(
 <View style = {styles.headerContainer}>
	 <Text style = {styles.headerText}> {subtitle.toUpperCase()}</Text>
</View>	
)

const styles = StyleSheet.create({
	headerContainer: {
		marginTop: 40
	},
	headerText:{
		color: '#fff0e8',
		fontSize: 18,
		fontWeight: '300'
	}
})

export default Subtitle