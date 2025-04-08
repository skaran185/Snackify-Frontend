import { trigger, state, style, transition, animate } from '@angular/animations';

export const cartAnimations = [
  trigger('slideUpDown', [
    state('up', style({
      transform: 'translateY(0)'
    })),
    state('down', style({
      transform: 'translateY(100%)'
    })),
    transition('up <=> down', [
      animate('300ms ease-in-out')
    ])
  ])
];
