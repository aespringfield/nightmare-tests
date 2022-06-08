import React from 'react';
import PropTypes from 'prop-types';

import 'stylesheets/select';

const Select = ({ id, className, onSelect, defaultValue, options }) => {
    const selectId = id || 'select';

    return (
        <div className={`select ${className}`}>
            <label htmlFor={selectId} className="visually-hidden">
                Sort jobs
            </label>
            <select
                id={selectId}
                defaultValue={defaultValue}
                onChange={(e) => {
                    onSelect(e.target.value);
                }}
            >
                {options.map(({ value, label }) => (
                    <option key={value} value={value} className={`select ${className}`}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};

Select.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onSelect: PropTypes.func,
    options: PropTypes.array,
    defaultValue: PropTypes.string,
};

Select.defaultProps = {
    className: '',
};

export default Select;
