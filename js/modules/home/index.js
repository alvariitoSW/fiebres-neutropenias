// Orquesta la navegación jerárquica de la app: menú principal, submenú de
// Citopenias y submenú de Trasplante. La lógica de cada calculadora vive en
// su propio módulo; aquí solo se decide qué vista se ve en cada momento.
import { createViewSwitcher } from '../../core/navigation.js';

export function init() {
    const topLevel = createViewSwitcher({
        home: document.getElementById('home-view'),
        escalas: document.getElementById('escalas-generales-view'),
        citopenias: document.getElementById('citopenias-view'),
        reconocimiento: document.getElementById('reconocimiento-view'),
        sindromes: document.getElementById('sindromes-view'),
        trasplante: document.getElementById('trasplante-view'),
    });

    document.getElementById('btn-escalas-generales').addEventListener('click', () => topLevel.show('escalas'));
    document.getElementById('btn-citopenias').addEventListener('click', () => topLevel.show('citopenias'));
    document.getElementById('btn-reconocimiento').addEventListener('click', () => topLevel.show('reconocimiento'));
    document.getElementById('btn-sindromes').addEventListener('click', () => topLevel.show('sindromes'));
    document.getElementById('btn-trasplante').addEventListener('click', () => topLevel.show('trasplante'));
    document.querySelectorAll('.btn-volver-home').forEach(b => b.addEventListener('click', () => topLevel.show('home')));

    const citopeniasLevel = createViewSwitcher({
        menu: document.getElementById('citopenias-menu-view'),
        neutropeniaFebril: document.getElementById('neutropenia-febril-container'),
    });
    document.getElementById('btn-neutropenia-febril').addEventListener('click', () => citopeniasLevel.show('neutropeniaFebril'));
    document.querySelectorAll('.btn-volver-citopenias-menu').forEach(b => b.addEventListener('click', () => citopeniasLevel.show('menu')));

    const trasplanteLevel = createViewSwitcher({
        menu: document.getElementById('trasplante-menu-view'),
        intro: document.getElementById('tph-intro-view'),
        cart: document.getElementById('tph-cart-view'),
    });
    document.getElementById('btn-tph-intro').addEventListener('click', () => trasplanteLevel.show('intro'));
    document.getElementById('btn-tph-cart').addEventListener('click', () => trasplanteLevel.show('cart'));
    document.querySelectorAll('.btn-volver-trasplante-menu').forEach(b => b.addEventListener('click', () => trasplanteLevel.show('menu')));

    topLevel.show('home');
    citopeniasLevel.show('menu');
    trasplanteLevel.show('menu');
}
