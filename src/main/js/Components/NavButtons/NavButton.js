import React from 'react'
import ArrowButton from './ArrowButton'
export default ({type, ...props})=>({
	up   : <ArrowButton {...props} position='up'   />,
	right: <ArrowButton {...props} position='right'/>,
	left : <ArrowButton {...props} position='left' />,
	down : <ArrowButton {...props} position='down' />,
	plus : <PlusButton  {...props}/>,
	none : <></>,
})[type]
