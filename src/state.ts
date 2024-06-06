class State {
    public element: HTMLElement;

    onEnter: () => void = () => {};
    onExit: () => void = () => {};

    nextState: () => State | void = () => {};

    onInit() {
        // TODO: what needs to be done before render, not sure
        this.onEnter();
    }

    onDestroy() {
        // TODO: housekeeping
        this.onExit();
    }

    constructor(params: StateParams) {
        this.element = document.createElement(params?.tagName ? params.tagName : 'div');

        if (params.innerText) {
            const innerText = document.createTextNode(params.innerText);
            this.element.appendChild(innerText);
        }
        
        if (params.effects) {
            params.effects(this.element, () => this.callNextState());
        }

        if (params.onEnter) {
            this.onEnter = params.onEnter;
        }

        if (params.onExit) {
            this.onExit = params.onExit;
        }

        if (params.nextState) {
            this.nextState = params.nextState;
        }

        if (params.children) {
            params.children.forEach(child => {
                this.element.appendChild(child().element);
            });
        }

        this.onInit();
    }

    callNextState() {
        this.onDestroy();

        const nextState = this.nextState() as State;

        this.element.replaceWith(nextState.element);
    }
}

interface ComposeParams {
    parent: State;
    children: State | State[];
}

interface StateParams {
    name: string;
    tagName?: string;
    className?: string | string[];
    idName?: string;
    innerText?: string;
    children?: any[];

    // TODO: must have access to state.this, do not provide element
    effects?: (element: HTMLElement, next: () => void) => void;
    nextState?: () => State;

    // TODO: implement compose
    compose?: ComposeParams;
    onEnter?: () => void;
    onExit?: () => void;
}

export function state(params: StateParams) {
    return () => new State(params);
}

/*
    so the idea is to define view as state
    state must have substates within, as usual DOM elements
    substate can be isolated or not
    view will trigger transition from one state to another
*/
