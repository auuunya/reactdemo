import React from 'react';
import './App.css';
import './block.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


const largeColumn = {
    width: '40%',
};

const midColumn = {
    width: '30%',
};

const smallColumn = {
    width: '10%',
};
function Button(props){
    const { onClick, className = '', children } = props;
    return (
        <button onClick={onClick} className={className} type="button">
            { children }
        </button>
    )
}

function Search(props){
    const { onSearchChange, onSearchSubmit, searchTerm, children } = props
    return (
        <form>
            <input type="text" 
                onChange={onSearchChange}
                value={searchTerm}
            />
            <button type="submit" onClick={onSearchSubmit}>{ children }</button>
        </form>
    )
}

function Table(props){
    const { list, onDismiss } = props
    return(
        <div className="table">
            {list.map(item => 
                <div key={item.objectID} className="table-row">
                    <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
                    <span style={smallColumn}>{item.points}</span>
                    <span style={smallColumn}>{item.author}</span>
                    <span style={midColumn}>{item.created_at}</span>
                    <span style={smallColumn}><Button className="button-inline" onClick={() => onDismiss(item.objectID)}>Delete</Button></span>
                </div>
            )}
        </div>
    )
}
class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            results: null,
            searchKey: '',
            result: null,
            searchTerm: DEFAULT_QUERY,
            error: null,
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
        console.log("result:", result)
        const { hits, page } = result
        const { searchKey, results } = this.state
        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
        const updateHits = [
            ...oldHits, ...hits
        ]
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updateHits, page}
            }
        })
    }
    fetchSearchTopStories(searchTerm, page=0){
        console.log("url:", `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
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
        const { hits, page } = results[searchKey];
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
      const { searchTerm, results, searchKey, error }  = this.state
      const page = (results && results[searchKey] && results[searchKey].page) || 0;
      const list = (results && results[searchKey] && results[searchKey].hits) || [];
      return (
        <div className="page">
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
                    <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>MORE</Button>
                </div>
            </div>
            }
        </div>
      )
    } 
}

export default App;
