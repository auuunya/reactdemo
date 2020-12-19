import React from 'react';
import './App.css';
import './block.css';

import Button from './components/Button/index';
import Search from './components/Search/index';
import Table from './components/Table/index';
import { DEFAULT_QUERY,DEFAULT_HPP,PATH_BASE,PATH_SEARCH,PARAM_SEARCH,PARAM_PAGE,PARAM_HPP } from './constants/index.js';

const Loading = () => <div>Loading ...</div>
// const withFoo = (Component) => (props) => <Component { ...props} />
// const withLoading = (Component) => ({ isLoading, ...rest }) => 
//     isLoading
//     ? <Loading />
//     : <Component { ...rest} />

const withInit = (Component) => (props) => <Component name="withInitName" { ...props} />

class Hello extends React.Component{
    componentDidMount(){
        console.log("111", this.props)
    }
    render(){
        return(
            <div>{ this.props.name }</div>
        )
    }
}
const InitComponent = withInit(Hello);

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    const { searchKey, results } = prevState
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updateHits = [
        ...oldHits, ...hits
    ]
    return {
        results: {
            ...results,
            [searchKey]: {hits: updateHits, page}
        },
        isLoading: false
    }
}
class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
            isLoading: false,
        }
        this.setSearchTopStories = this.setSearchTopStories.bind(this)
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
        this.onDismiss = this.onDismiss.bind(this)
        this.onSearchSubmit = this.onSearchSubmit.bind(this)
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
    }
    needsToSearchTopStories(searchTerm){
        return !this.state.results[searchTerm]
    }
    componentDidMount(){
        const { searchTerm } = this.state;
        this.setState({searchKey: searchTerm})
        this.fetchSearchTopStories(searchTerm)
    }
    setSearchTopStories(result) {
        const { hits, page } = result
        this.setState(updateSearchTopStoriesState(hits, page))
    }
    fetchSearchTopStories(searchTerm, page=0){
        console.log("url:", `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        this.setState({isLoading: true});
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(response => response.json())
        .then(result => this.setSearchTopStories(result))
        .catch(e => this.setState({error: e}));
    }
    onSearchChange(text){
        this.setState({
            searchTerm: text.target.value
        })
    }
    onSearchSubmit(e){
        const { searchTerm } = this.state
        this.setState({searchKey: searchTerm})
        if (this.needsToSearchTopStories(searchTerm)){
            this.fetchSearchTopStories(searchTerm);
        }
        e.preventDefault();
    }
    onDismiss(id){
        // const isNotId = item => item.objectID !== id;
        // const updateHits = this.state.result.hits.filter(isNotId)
        // hits 覆盖掉了 state.result 里面的hits
        const { searchKey, results } = this.state;
        const { page } = results[searchKey];
        const updateHits = {hits: this.state.result.hits.filter(item => {
            return item.objectID !== id
        })}
        this.setState({
            // { ...this.state.result, updateHits} 可替换
            results: {
                ...results,
                [searchKey]: {hits: updateHits, page}
            }
        })
    }
    render(){
      const { isLoading, results, searchKey, error  }  = this.state
      const page = (results && results[searchKey] && results[searchKey].page) || 0;
      const list = (results && results[searchKey] && results[searchKey].hits) || [];
      return (
        <div className="page">
            <InitComponent />
            { error
            ? <div className="interactions">
                <p>Something went wrong.</p>
            </div>
            : <div className="interactions">
                <Search onSearchChange={this.onSearchChange} searchTerm={this.state.searchTerm} onSearchSubmit={this.onSearchSubmit}>Search</Search>
                <Table 
                    list={list}
                    onDismiss={this.onDismiss}
                />
                <div className="interactions">
                    {
                        isLoading
                        ? <Loading />
                        : <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>MORE</Button>
                    }
                </div>
            </div>
            }
        </div>
      )
    } 
}

export default App;
