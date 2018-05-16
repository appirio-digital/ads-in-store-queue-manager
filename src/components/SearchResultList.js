import React from 'react';
import SearchListRow from './SearchListRow';

export default class SearchResultList extends React.Component {
  render() {
    const { storeList, onBookAction } = this.props;
    return (
      <div className="cards-list">
        {storeList.length > 0 &&
          <h4 style={{ textAlign: 'center' }}>Tomorrow's available slots!</h4>}
        <div className="row">
          {storeList.map((storeItem, index) => {
            return (
              <SearchListRow
                key={index}
                storeItem={storeItem}
                onBookAction={onBookAction}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
