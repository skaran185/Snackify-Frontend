import { AnimationController, Animation } from '@ionic/angular';

export function slideInRightAnimation(animationCtrl: AnimationController, element: Element): Animation {
  return animationCtrl.create()
    .addElement(element)
    .duration(300)
    .easing('ease-out')
    .fromTo('transform', 'translateX(100%)', 'translateX(0)');
}
