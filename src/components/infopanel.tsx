const InfoPanel = () => {
    return (
        <div className="sidebar right-0">
            {/* storage */}
            <div>
                <h4>Internal Storage</h4>
                <div>
                    <progress max={64} value={48}></progress>
                    <span>16GB Free of 64GB</span>
                </div>
            </div>
            {/* battery */}
            <div>
                <h4>Battery</h4>
                <div>
                    <progress max={100} value={75}></progress>
                    <span>75% - Charging</span>
                </div>
            </div>
        </div>
    );
}

export default InfoPanel;