import { state } from './state';

const secondState = state({
  name: 'secondState',
  innerText: 'this is second state',
  className: 'first-state',
});

const firstState = state({
  name: 'firstState',
  innerText: 'this is first state',
  className: 'second-state',

  children: [
    state({
      name: 'empty',
      className: 'wrapper',

      children: [
        state({
          name: 'state-button',
          tagName: 'button',
          innerText: 'click me',

          nextState: secondState,

          effects: (element, next) => {
            element.addEventListener('click', () => {
                next();
            });
          },
        })
      ]
    })
  ],

});

document.body.appendChild(firstState().element);