import React, {Component, useState} from 'react'
import {Card, Collapse, Modal} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DBAwareEdiText from './DBAwareEdiText'
import CategoryCard from "./CategoryCard"

/**
 * Props:
 *   - categoryId: String (the Category ID of this category)
 *   - changePage: function (the function that will be called when clicking on items in this category to go to a new
 *                           page)
 *   - loggedIn: boolean (whether this category is being displayed in a context where the viewer is a logged in user)
 */

// function Category2(props)
// {
//     const {categoryId,changePage}=props
//     const [name,setName]=useState('')
//     const [items,setItems]=useState([])
//     const [loading,setLoading]=useState('')
// }




export default class Category2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            items: [],
            loading: true,
            isMyCategory:false
        }
    }

    async componentDidMount() {
        try {


            let props = this.props
            let categoryId = props.categoryId
            let changePage = props.changePage

            if(this.props.loggedIn && await window.isMyCategory(categoryId))
            {
                this.setState({isMyCategory:true})
            }

            // fetch category information
            let categoryInfoRes = await fetch('/category/info?id=' + categoryId)
            categoryInfoRes = await categoryInfoRes.json()
            // console.log("CATEGORY: ",categoryInfoRes)
            if (categoryInfoRes.status !== 'OK') throw new Error('Failed to fetch category with ID: ' + categoryId)

            let type = categoryInfoRes.content.type
            let creator = categoryInfoRes.content.creator
            let searchText = categoryInfoRes.content.searchText
            let name = categoryInfoRes.content.name
            let searchRes


            if(searchText==="LikedByMe"){
                searchRes = await fetch(`/likes/GetlikedItem?type=${type}`)
            }
            else{
                // use category information to search for users/content
                searchRes = await fetch('/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: type,
                        creator: creator,
                        searchText: searchText
                    })
                })
            }
            searchRes = await searchRes.json()
            if (searchRes.status !== 'OK') throw new Error('Failed to search')

            // map the returned users/content into items that can be displayed in this category
            let users = searchRes.content.users
            let content = [...searchRes.content.series,...searchRes.content.episodes,...searchRes.content.frames]
            users = users.map((user) => {
                return {
					title        : user.generalBase.title,
					thumbnail    : user.sketch.thumbnail,
					sketchId     : user.sketch.id,
					generalBaseId: user.generalBase.id,
					userId       : user.user.id,
                    onClick() {
                        changePage('userInfo', {
                            userId: user.user.id,
                        })
                    }
                }
            })
            content = content.map((frame) => {
                return {
					title        : frame.generalBase.title,
					sketchId     : frame.sketch.id,
					generalBaseId: frame.generalBase.id,
					contentBaseId: frame.contentBase.id,
                    onClick() {
                        changePage('viewContentPage', { contentBaseId: frame.contentBase.id })
                    }
                }
            })

            // add the mapped users/content into this category's list of items
            this.setState({
                name: name,
                items: [...content,...users],
                loading: false
            })
        } catch (err) {
            console.error(err)
        }
    }

    render() {

        const handleDelete=()=>
        {
            if(window.confirm("Are you sure you want to delete this category?"))
            {
                window.deleteCategory(categoryId)
            }
        }

        const handleChangeType=(type)=>{
            window.setCategoryType(categoryId,type)
        }

        const handleChangeSearch=()=>{
            const text=window.prompt("Please enter a search query for this category: ")
            if(text==null)
            {
                window.alert("Cancelled changing the category's search query")
            }
            else
            {
                delete window.setCategorySearchText(categoryId, text)
                alert("Set search text to "+JSON.stringify(text))
            }
        }

		let items     =this.state.items
		let loggedIn  =this.props.loggedIn
		let categoryId=this.props.categoryId
		let name      =this.state.name
		let loading   =this.state.loading
        const categoryFontSize = '30px'
        // const [notCollapsed, setNotCollapsed] = useState(true)
        // const [askIfDelete, setAskIfDelete] = useState(false)
        // const removeAsker = (
        //     <div className='mx-auto'>
        //         Are you sure you want to remove this category?
        //         <span>
        //             <Button onClick={remove} variant={'danger'}>Yes</Button>
        //             <Button onClick={() => setAskIfDelete(false)}>No</Button>
        //         </span>
        //     </div>
        // )


        const controls=<span>
			<Button onClick={handleDelete}>
				Delete
			</Button>
			<Button onClick={handleChangeSearch}>
				Change Search Text
			</Button>
            <select onChange={event=>handleChangeType(event.target.value)}>
                <option                 label="(Select Type)" selected disabled />
                <option value="All"     label="All"                             />
                <option value="Content" label="Content"                         />
                <option value="User"    label="User"                            />
                <option value="Series"  label="Series"                          />
                <option value="Episode" label="Episode"                         />
                <option value="Frame"   label="Frame"                           />
            </select>
        </span>

        const cards = <Card.Body style={{overflowX: 'scroll'}}>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                {items.map(x =>
                                    <td key={x.generalBaseId}>
                                        {
                                            x.userId ?
                                                <CategoryCard userId={x.userId} onClick={x.onClick}/>
                                                    :
                                                <CategoryCard contentBaseId={x.contentBaseId} onClick={x.onClick}/>
                                        }
                                    </td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card.Body>


        return <Card>
                <Card.Header>
                    <div style={{display: 'flex', flexDirection: 'vertical'}}>
                        {
                            !(loggedIn&&this.state.isMyCategory) ?
                                <span className='mx-auto' style={{'fontSize': categoryFontSize}}>
									{name}
                                </span>
                                :
                                <>
                                    <div className='mx-auto'>
                                        {
                                            loading ?
                                                'Loading...'
                                                    :
                                                <>
                                                    {controls}
                                                <DBAwareEdiText viewProps={{style: {fontSize: categoryFontSize}}}
                                                    // inputProps	={{style:{'fontSize':categoryFontSize}}}
                                                                value={name} type={'text'} onSave={name=>window.setCategoryName(categoryId,name)}/>
                                                </>
                                        }
                                    </div>
                                </>
                        }
                    </div>
                </Card.Header>
                {cards}
            </Card>
    }
}