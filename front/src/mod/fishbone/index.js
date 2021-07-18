import React from 'react';

const markup = `<div style="padding: 2px;width: 24%;float:left;min-height: 1000px;">
    <p class="note">- Type brainstorm protocol below</p>
    <p class="note">- Redraw happens on Enter or use <button id="refresh">Refresh</button></p>
    <p class="note">- Use double-click on node to drill down</p>
    <p class="note">- Click to <a href="#">get back to root</a></p>
<textarea id="structure" style="width:100%; min-height: 600px;">
A Problem
- People
-- Fatigue
--- Why?
---- Why?
     ! Comment node with exclamation / @author / + for pros
     ! Comment node with exclamation / @author / - for cons

- Interactions
-- Precedent
--- Why?

- Processes
-- A lot of meetings
--- Why?

- Materials
-- Slow server
--- Why?

- Environment
-- Market is down
--- Why?

- Requirements
-- Too large stories
--- Why?
</textarea>
</div>

<div id="target" style="border: dotted 1px #000; min-height: 1000px; width: 75%;float:right"></div>

    `;

class FishBoneViewer extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        window.fishbone();
    }
    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: markup}}></div>
        );
    }
}

export default FishBoneViewer;