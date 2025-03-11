import './TwoPanels.scss';

function TwoPanels({ left, right }) {
    return (
        <div className="TwoPanels">
            <div className="panel panel-left">{ left }</div>
            <div className="panel panel-right">{ right }</div>
        </div>
    );
}

export default TwoPanels;
