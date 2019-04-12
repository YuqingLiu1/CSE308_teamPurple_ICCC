// import Thumbnail from './Components/thumbnail'
import Category from './category'
// import React, {Component} from 'react'
// import Menubar from './Components/menubar'
// import UserInfo from './Components/userinfo'
//
// class App extends Component
// {
// 	render()
// 	{
// 		return <>
// 			<link
// 				rel="stylesheet"
// 				href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
// 				integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
// 				crossOrigin="anonymous"
// 			/>
// 			<link
// 				rel="stylesheet"
// 				href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
// 				integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
// 				crossOrigin="anonymous"
// 			/>
// 			<div className="App">
// 				<Category title="Hello"/>
// 			</div>
// 		</>
// 	}
// }
//
// export default App

import React, {Component} from "react"
import ReactDOM from "react-dom"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"

// fake data generator
const getItems=count=>
	Array.from({length: count}, (v, k)=>k).map(k=>({
		id     : `item-${k}`,
		content: <Category title="CategoryTitle"/>
	}))

// a little function to help us with reordering the result
const reorder=(list, startIndex, endIndex)=>
{
	const result   =Array.from(list)
	const [removed]=result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

const grid=8

const getItemStyle=(isDragging, draggableStyle)=>({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding   : 0,
	margin    : 0,
	'margin-bottom': '25px',
	'background':'rgba(0,0,0,0)',


	// change background colour if dragging
	// background: isDragging ? "lightgreen" : "grey",

	// styles we need to apply on draggables
	...draggableStyle
})

const getListStyle=isDraggingOver=>({
	background: isDraggingOver ? "lightblue" : "lightgrey",
	padding   : grid,
	width     : '100%'
})

class App extends Component
{
	constructor(props)
	{
		super(props)
		this.state    ={
			items: getItems(10)
		}
		this.onDragEnd=this.onDragEnd.bind(this)
	}

	onDragEnd(result)
	{
		// dropped outside the list
		if(!result.destination)
		{
			return
		}

		const items=reorder(
			this.state.items,
			result.source.index,
			result.destination.index
		)

		this.setState({
						  items
					  })
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render()
	{
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided, snapshot)=>(
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							style={getListStyle(snapshot.isDraggingOver)}
						>
							{this.state.items.map((item, index)=>(
								<Draggable key={item.id} draggableId={item.id} index={index}>
									{(provided, snapshot)=>(
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											style={getItemStyle(
												snapshot.isDragging,
												provided.draggableProps.style
											)}
										>
											{item.content}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		)
	}
}

// Put the thing into the DOM!
// ReactDOM.render(<App />, document.getElementById("root"));
export default App