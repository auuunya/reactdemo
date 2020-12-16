import React from 'react';
import './App.css';

function UserName(props){
    return (
        <div>
            Hello, { props.name }
        </div>
    )
}
const arrMap = [
    {
        id:1,
        name:"AuuuNya",
        age:25
    },
    {
        id:2,
        name:"TuuuNya",
        age:23
    }
]
function Button(props){
    console.log("button", props)
    const { onClick, className = '', children } = props;
    return (
        <button onClick={onClick} className={className} type="button">
            { children }
        </button>
    )
}
function Search(props){
    const { onSearchChange, searchValue, children } = props
    return (
        <form>
            { children }<input type="text" 
                onChange={onSearchChange}
                value={searchValue}
            />
        </form>
    )
}

const Table = ({ arrMap, isSearch, searchValue, deleteHandle }) => 
    <div>
        {arrMap.filter(isSearch(searchValue)).map(item => 
            <div key={item.id}>
                <span>{item.id}</span>
                <span>name:{item.name}</span>
                <span>age:{item.age}</span>
                <span><Button onClick={() => deleteHandle(item.id)}>Delete</Button></span>
            </div>
        )}
    </div>
class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: "AuuuNya",
            arrMap,
            searchValue: "",
        }
        this.deleteHandle = this.deleteHandle.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
    }

    isSearch(searchItem){
        return function(item){
            return item.name.toLowerCase().includes(searchItem.toLowerCase())
        }
    }
    // const isSearch = searchItem => item => item.name.toLowerCase().includes(searchItem.toLowerCase());
    deleteHandle(id){
        const newArr = this.state.arrMap.filter((item)=> {
            return item.id !== id
        })
        this.setState({
            arrMap: newArr
        })
        console.log("111",this.state.arrMap)
    }

    onSearchChange(event){
        this.setState({
            searchValue: event.target.value
        })
    }
    render(){
      return (
        <div className="App">
            <UserName name={this.state.name}/>
            <Search onSearchChange={this.onSearchChange} searchValue={this.state.searchValue}>Search</Search>
            <Table  arrMap={this.state.arrMap} isSearch={this.isSearch} searchValue={this.state.searchValue} deleteHandle={this.deleteHandle} />
        </div>
      )
    } 
}

export default App;
