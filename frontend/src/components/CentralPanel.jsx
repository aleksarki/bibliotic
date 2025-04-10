import "./CentralPanel.scss";

function CentralPanel({ children, title }) {
    return (
        <div className="CentralPanel">
            <div className="panel">
                <span className="panel-title">{ title }</span>
                { children }
            </div>
        </div>
    );
}

export default CentralPanel;
