import EdiText from 'react-editext'
// import InlineEdit from 'react-ions/lib/InlineEdit'
import React, { Component } from 'react'
import {Card, Collapse, Modal} from 'react-bootstrap'
import Thumbnail from './Thumbnail'
import Button from 'react-bootstrap/Button'
import DBAwareEdiText from './DBAwareEdiText'

// ( {
//         items = [{contentBaseId: 1}, {contentBaseId: 2}, {contentBaseId: 3}]
//         ,
//         editable
//         ,
//         title
//         ,
//         setTitle
//         ,
//         remove
//         ,
//         loggedIn = true
//     }
// )

export default class Category2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            items: []
        };
    }

    async componentDidMount() {
        try {
            let categoryId = this.props.categoryId;

            // fetch category information
            let categoryInfoRes = await fetch('/category/info?id=' + categoryId);
            categoryInfoRes = await categoryInfoRes.json();
            if (categoryInfoRes.status !== 'OK') throw new Error('Failed to fetch category with ID: ' + categoryId);

            let type = categoryInfoRes.content.type;
            let creator = categoryInfoRes.content.creator;
            let searchText = categoryInfoRes.content.searchText;
            let name = categoryInfoRes.content.name;

            // use category information to search for users/content
            let searchRes = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: type,
                    creator: creator,
                    serachText: searchText
                })
            });
            searchRes = await searchRes.json();
            if (searchRes.status !== 'OK') throw new Error('Failed to search');

            // map the returned users/content into items that can be displayed in this category
            let items = [];
            let users = searchRes.content.users;
            let series = searchRes.content.series;
            let episodes = searchRes.content.episodes;
            let frames = searchRes.content.frames;
            let changePage = this.props.changePage;
            // TODO: handle mapping users
            series = series.map((series) => {
                return {
                    title: series.generalBase.title,
                    thumbnail: series.sketch.thumbnail,
                    sketchId: series.sketch.id,
                    generalBaseId: series.generalBase.id,
                    contentBaseId: series.contentBase.id,
                    onClick() {
                        changePage('viewContentPage', {
                            initialContentBaseId: series.contentBase.id,
                            initialSketchId: series.sketch.id
                        })
                    }
                }
            });
            episodes = episodes.map((episode) => {
                return {
                    title: episode.generalBase.title,
                    thumbnail: episode.sketch.thumbnail,
                    sketchId: episode.sketch.id,
                    generalBaseId: episode.generalBase.id,
                    contentBaseId: episode.contentBase.id,
                    onClick() {
                        changePage('viewContentPage', {
                            initialContentBaseId: episode.contentBase.id,
                            initialSketchId: episode.sketch.id
                        })
                    }
                }
            });
            frames = frames.map((frame) => {
                return {
                    title: frame.generalBase.title,
                    thumbnail: frame.sketch.thumbnail,
                    sketchId: frame.sketch.id,
                    generalBaseId: frame.generalBase.id,
                    contentBaseId: frame.contentBase.id,
                    onClick() {
                        changePage('viewContentPage', {
                            initialContentBaseId: frame.contentBase.id,
                            initialSketchId: frame.sketch.id
                        })
                    }
                }
            });

            // add the mapped users/content into this category's list of items
            items.push.apply(items, series);
            items.push.apply(items, episodes);
            items.push.apply(items, frames);

            this.setState({
                name: name,
                items: items
            });
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        let items = this.state.items;
        let loggedIn = this.props.loggedIn;
        let name = this.state.name;
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
        // );
        const cards = <Card.Body style={{overflowX: 'scroll'}}>
            <div>
                <table>
                    <tbody>
                    <tr>
                        {items.map(x =>
                            <td key={x.contentBaseId}>
                                <Thumbnail imageURL={x.thumbnail || undefined} title={x.title} onClick={x.onClick}/>
                            </td>)}
                    </tr>
                    </tbody>
                </table>
            </div>
        </Card.Body>
        return (
            <Card>
                <Card.Header>
                    <div style={{display: 'flex', flexDirection: 'vertical'}}>
                        {
                            !loggedIn ?
                                <span className='mx-auto' style={{'fontSize': categoryFontSize}}>{title}</span>
                                    :
                                <>
                                    {/*<Button variant="danger"*/}
                                            {/*onClick={() => setAskIfDelete(true)}>*/}
                                        {/*{<i className="fas fa-minus-circle"/>}*/}
                                    {/*</Button>*/}
                                    {/*<Button onClick={() => setNotCollapsed(!notCollapsed)}>{notCollapsed ? '▼' : '▲'}</Button>*/}
                                    <div className='mx-auto'>
                                        <DBAwareEdiText viewProps={{style: {fontSize: categoryFontSize}}}
                                            // inputProps	={{style:{'fontSize':categoryFontSize}}}
                                                        value={name} type={'text'} onSave={alert}/>
                                    </div>
                                </>
                        }
                    </div>
                    {/*<Collapse in={askIfDelete}>*/}
                        {/*{removeAsker}*/}
                    {/*</Collapse>*/}
                </Card.Header>
                {/*<Collapse in={notCollapsed}>*/}
                    {/*{cards}*/}
                {/*</Collapse>*/}
                {cards}
            </Card>
        );
    }
}