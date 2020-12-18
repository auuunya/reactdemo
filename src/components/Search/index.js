import React from 'react';
class Search extends React.Component{
    componentDidMount(){
        if(this.input){
            this.input.focus();
        }
    }

    render(){
        const { onSearchChange, onSearchSubmit, searchTerm, children } = this.props;
        return (
            <form onSubmit={onSearchSubmit}>
                <input type="text" 
                    onChange={onSearchChange}
                    value={searchTerm}
                    ref={ (node) => { this.input = node; }}
                />
                <button type="submit">{ children }</button>
            </form>
        )
    }
}
export default Search;