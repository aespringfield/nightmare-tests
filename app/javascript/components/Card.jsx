import React from 'react';
import PropTypes from 'prop-types';

import 'stylesheets/card';
import propTypes from "prop-types";

const Card = ({ children, id, className }) => (
    <div id={id} className={`card p-10 ${className}`}>{children}</div>
);

Card.propTypes = {
    id: propTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Card;
