/*
 * Layout in shape of two panels.
 */

import './TwoPanels.scss';

function TwoPanels({ left, right }) {
    return (
        <div className="TwoPanels">
            <div className="panel-left">{ left }</div>
            <div className="panel-right">{ right }</div>
        </div>
    );
}

export default TwoPanels;
