import React from 'react';
import Popup from 'reactjs-popup';

const Modal = () => (
    <Popup trigger={<button className="button"> Open Modal </button>} modal>
        <span> Modal content </span>
    </Popup>
);