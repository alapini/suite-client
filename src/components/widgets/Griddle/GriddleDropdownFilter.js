/* eslint-disable react/no-multi-comp */
import React,{ Component } from 'react';
import {MenuItem,Button,ButtonToolbar,DropdownButton,Checkbox,Popover,OverlayTrigger} from 'react-bootstrap';


class GriddleDropdown extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      filteringBy: [],
      showImage: false,
      popover: false
    };
  }

  popoverOpen = () => {
    this.setState({ popover: true});
  };

  popoverClose = () => {
    this.setState({ popover: false});
  };

  textOnClick = (e) => {
    e.stopPropagation();
    if(this.state.showImage === false){
      this.setState({showImage: true});
    } else
    {this.setState({showImage: false});}
  };

  clearFilter = (e) => {
    this.textOnClick(e);
    this.setState({ filteringBy: [] });
    this.props.filterByColumn('',this.props.columnName);
  };

  sortColumn = (eventKey) => {
    if(eventKey === 'asc') console.log('sort the '+this.props.columnName+' column Ascending');
    if(eventKey === 'des') console.log('sort the '+this.props.columnName+' column Descending');
  };

  filterThisColumn = (e) => {
    e.persist(); // keep event from bubbling
    const filtervalue = e.target.dataset.filtervalue; // get value to sort by.
    const temparray = this.state.filteringBy;         // will need to alter the array, but should not edit state directly.

    if(temparray.indexOf(filtervalue) === -1) {
      // add to state and then filter column
      temparray.push(filtervalue);
      this.setState({ filteringBy: temparray});
      this.props.filterByColumn(filtervalue, this.props.columnName); // !!!!! this only filters by one parameter, will need to be reconfigured for multiple parameters
    } else {
      // remove from state then re-filter
      for(let i = temparray.length; i--;){
        if (temparray[i] === filtervalue) temparray.splice(i, 1);
      }
      this.setState({ filteringBy: temparray});
      this.props.filterByColumn('', this.props.columnName); // !!!!! this only filters by one parameter, will need to be reconfigured for multiple parameters, temporarily clears filter for this column
    }
  };

  render(){
    const {columnName} = this.props;
    const DropdownImage = this.state.showImage? "fa fa-sort-amount-desc" : "fa fa-sort-amount-asc";
    const info = this.props.info || [];
    let filterlist = [];

    /* When filterType is "select", output Checkboxes */
    // if there's data to use...
    if (info.length > 0 && this.props.filterType === 'select') {
      const colData = new Set();

      // get all the values in this column, at to a Set object (keeps only unique values, ignores duplicates).
      info.map((obj) => {
        colData.add(obj[this.props.columnName]);
      });

      // reassign
      const colArray = [...colData];

      // sort ascending...
      // ... if by number or by alphanumeric...
      if (typeof colArray[0] === 'number') {
        colArray.sort(function (a, b) {
          return a - b; // ascending
        });
      } else {
        colArray.sort(); // ascending by default
      }

      // output checkboxes for each unique item to filter by.
      filterlist = colArray.map((obj) => {
        return (
          <li className="griddlefilter__filter-item" key={obj.toString()}>
            <Checkbox
              className="griddlefilter__checkbox"
              onClick={this.filterThisColumn}
              defaultChecked={(this.state.filteringBy.indexOf(obj) > -1) ? true : null}
              data-filtervalue={obj}
            >{obj}</Checkbox>
          </li>
        );
      });
    }
    const popoverBottom = (
      <Popover data-toggle="popover" className="griddlefilter__popover arrow" id={"overload-bottom"+columnName} positionLeft="100" >

        <div className="griddlefilter__sortstyle">
          <Button className="griddlefilter__linkbutton" bsStyle="link" onClick={this.clearFilter}>Clear All</Button>
        </div>

        <div className="griddlefilter__sort text-muted" >Sort By</div>

        <div className="griddlefilter__dropdownbutton">
          <DropdownButton title="Descending" id={'sort-for-'+this.props.columnName+'-column'} className="griddlefilter__sortdropdown" block>
            <MenuItem eventKey={'des'} onSelect={this.sortColumn}>Descending</MenuItem>
            <MenuItem eventKey={'asc'} onSelect={this.sortColumn}>Ascending</MenuItem>
          </DropdownButton>
        </div>

        { this.props.filterType === 'select' ?
          <div className="griddlefilter__sort text-muted">Filter By</div>
          :
          null
        }
        { this.props.filterType === 'select' ?
          <span className="griddlefilter__dropdownitem">
            <ul className="griddlefilter__filter-container" style={{'listStyle':'none outside none'}}>
              {filterlist}
            </ul>
          </span>
          :
          null
        }
      </Popover>
    );

    return(
      <OverlayTrigger className="griddlefilter__overlay" trigger="click" rootClose={true} placement="bottom" overlay={popoverBottom} onEntered={this.popoverOpen} onExited={this.popoverClose}>
        <Button bsStyle="link" id={'griddle__header-'+ this.props.displayName} className={'griddlefilter__header-button' + ((this.state.popover)? ' griddlefilter__header-button--active' : '')} onClick={this.textOnClick}> {columnName} <i className={DropdownImage} /></Button>
      </OverlayTrigger>
    );
  }
}
GriddleDropdown.propTypes = {
  info: React.PropTypes.array,
  filterType: React.PropTypes.oneOf(['select','range']),
  content: React.PropTypes.object,
  columnName: React.PropTypes.string,
  displayName: React.PropTypes.string,
  filterByColumn: React.PropTypes.func
};

export default GriddleDropdown;
