import PropTypes from 'prop-types';
import Button from '../Button/index';
import React from 'react';
import { sortBy } from 'lodash';
import classNames from 'classnames';
const largeColumn = {
    width: '40%',
};

const midColumn = {
    width: '30%',
};

const smallColumn = {
    width: '10%',
};
const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
}
const Sort = ({ sortKey, onSort, activeSortKet, children }) => {
    const sortClass = classNames(
        'button-inline',
        { 'button-active': sortKey === activeSortKet}
    );
    return (
        <Button onClick={ () => onSort(sortKey) } className={sortClass}>
            { children }
        </Button>
    )
}
    
class Table extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            sortKey: 'NONE',
            isSortReverse: false,
        };
        this.onSort = this.onSort.bind(this)
    }
    onSort(sortKey){
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({sortKey, isSortReverse});
    }
    render(){
    const { list, onDismiss } = this.props
    const { sortKey, isSortReverse } = this.state
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList
    return(
            <div className="table">
                <div className="table-header">
                    <span style={largeColumn}>
                        <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKet={sortKey}>
                            Title
                        </Sort>
                    </span>
                    <span style={smallColumn}>
                        <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKet={sortKey}>
                            Author
                        </Sort>
                    </span>
                    <span style={smallColumn}>
                        <Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKet={sortKey}>
                            Comments
                        </Sort>
                    </span>
                    <span style={midColumn}>
                        <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKet={sortKey}>
                            Points
                        </Sort>
                    </span>
                    <span style={smallColumn}>
                        Archive
                    </span>
                </div>
                {reverseSortedList.map(item => 
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
}
Table.propTypes = {
    list: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired
}

export default Table;