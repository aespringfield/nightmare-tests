import React, { useCallback, useEffect, useState } from 'react';
import { debounce, capitalize } from 'lodash';
import axios from 'axios';
import PropTypes from 'prop-types';
const indefinite = require('indefinite');

const SelectSearchable = ({ name, ...props }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [resultChosen, setResultChosen] = useState(false)
    const [recordName, setRecordName] = useState('');
    const [recordId, setRecordId] = useState('');
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [hasSavedRecord, setHasSavedRecord] = useState(null)

    const id = props.id || `select-${name}`;
    const placeholder = props.placeholder || `${capitalize(name)} Name${props.allowIdSearch ? ' or ID' : ''}`
    const idFieldName = props.idFieldName || `${name}_id`
    const nameFieldName = props.nameFieldName || `${name}_name`
    const searchFields = props.allowIdSearch
        ? [ 'id', ...props.searchFields.filter((field) => field !== 'id')]
        : props.searchFields

    useEffect(() => {
        if(resultChosen) {
            setIsSearching(false)
            return
        }
        executeSearch()
        updateRecordName()
    }, [searchTerm, resultChosen])

    const isIdSearch = () => {
        return props.allowIdSearch && !!searchTerm && !isNaN(searchTerm) && !isNaN(Number(searchTerm))
    }

    const searchFn = useCallback(
        debounce((term, params ) => {
            axios.get(props.recordSearchPath, { params: { query: term, fields: searchFields, ...params } })
                .then((response) => {
                    setIsSearching(true)
                    setSearchResults(response.data)
                })
        }, 300), []
    );

    const clearSearch = () => {
        setIsSearching(false)
        setSearchResults([])
    }

    const updateRecordName = () => {
        if (isIdSearch(searchTerm)) {
            setRecordId(searchTerm)
            setRecordName('')
        } else {
            setRecordId('')
            setRecordName(searchTerm)
        }
    }

    const executeSearch = () => {
        if(searchTerm.length === 0) {
            setIsSearching(false)
            setSearchResults([])
            return;
        } else if(searchTerm.length < props.minimumSearchTermLength) {
            return;
        }

        searchFn(searchTerm, props.additionalSearchQueryParams)
    }

    const clearRecordId = () => {
        isIdSearch() ? setRecordName('') : setRecordId('')
        setSearchResults([])
        setHasSavedRecord(false)
    }

    const renderRecordName = () => {
        if (hasSavedRecord) {
            return (
                <>
                    <label htmlFor={id} className="visually-hidden">Filter meetups</label>
                    <div id={id} className="input-group-field supplier-selected-name">
                        <div className="selection">
                            <div className="name">
                                { isIdSearch() ? `${recordId} - ${recordName}` : recordName }
                            </div>
                            <div className="remove" onClick={clearRecordId}>
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <input
                    id={id}
                    type="text"
                    name={name}
                    value={searchTerm}
                    onChange={(e) => {
                        if(props.onChange) {
                            props.onChange(e)
                        }

                        setResultChosen(false)
                        setSearchTerm(e.target.value)
                    }}
                    onFocus={executeSearch}
                    onBlur={() => {
                        setIsSearching(false)
                        clearSearch()
                    }}
                    className="input-group-field"
                    autoComplete="off"
                    placeholder={placeholder}
                />
            )
        }
    }

    const renderNoResultsForIDMessage = () => (
        <div className="create-supplier search-result clearfix">
            <div className="float-left">No record found with this ID</div>
        </div>
    );

    const renderSearchResults = () => {
        return (
            <div className={`search-results ${isSearching ? 'show' : '' }`}>
                {
                    isIdSearch() && isSearching && searchResults.length === 0 &&
                    renderNoResultsForIDMessage()
                }
                <div data-testid="search-results">
                    {
                        searchResults.map((result) => {
                            return renderSearchResult(result);
                        })
                    }
                </div>
            </div>
        )
    }

    const renderSearchResult = (result) => {
        return (
            <div
                className="search-result"
                key={result.id}
                id={`supplier-search-${result.id}`}
                onMouseDown={() => {
                    setResultChosen(true)
                    setSearchTerm(result.title);
                }}
            >
                <div className="name">{result.title}</div>
                {
                    isIdSearch() &&
                    <div>{result.id}</div>
                }
            </div>
        )
    }

    return (
        <>
            <div className="select-searchable-container">
                <div className="select-searchable" data-testid={`${name}-select`}>
                    {/*<label*/}
                    {/*    className="select optional disabled sub-header"*/}
                    {/*    htmlFor={props.id}>*/}
                    {/*    {label}*/}
                    {/*</label>*/}
                    <div className="input-group supplier-name-container">
            <span className="input-group-label icon">
              <i className="far fa-search"></i>
            </span>
                        {renderRecordName()}
                    </div>

                    <input type="hidden" name={idFieldName} value={recordId} />
                    <input type="hidden" name={nameFieldName} value={recordName} />

                    {renderSearchResults()}
                </div>
                <button className="select-searchable-button button primary" onClick={() => {
                    console.log(searchTerm)
                    props.onFilter(searchTerm)
                }}>
                    Filter
                </button>
            </div>

        </>
    );
}

SelectSearchable.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    recordSearchPath: PropTypes.string.isRequired,
    searchFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    minimumSearchTermLength: PropTypes.number.isRequired,
    id: PropTypes.string,
    idFieldName: PropTypes.string,
    nameFieldName: PropTypes.string,
    placeholder: PropTypes.string,
    stateCode: PropTypes.string,
    allowIdSearch: PropTypes.bool,
    additionalSearchQueryParams: PropTypes.object
}

SelectSearchable.defaultProps = {
    searchFields: ['name'],
    type: 'text',
    allowIdSearch: false,
    minimumSearchTermLength: 3,
}

export default SelectSearchable;
