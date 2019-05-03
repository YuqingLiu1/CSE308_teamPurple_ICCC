require('@babel/polyfill');

import Category from './Category';
import Category2 from './Category2';

import React, {Component} from "react"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"

// hardcoded Category IDs of site-wide visible homepage categories
const ALL_SERIES_CATEGORY_ID = "5ccc5fbc1c9d440000c181a2";
const ALL_USERS_CATEGORY_ID = "5ccc626d1c9d440000c181a3";

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
    // 'margin-bottom': '25px',
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
            items: this.getItems()
        }
        this.onDragEnd=this.onDragEnd.bind(this)
    }

    // generate the site-wide visible homepage categories
    getItems = () =>
    [
        {
            id: 1,
            content:
                <Category2
                    categoryId={ALL_SERIES_CATEGORY_ID}
                    loggedIn={false}
                    changePage={this.props.changePage}
                />
        },
        {
            id: 2,
            content:
                <Category2
                    categoryId={ALL_USERS_CATEGORY_ID}
                    loggedIn={false}
                    changePage={this.props.changePage}
                />
        }
    ];

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