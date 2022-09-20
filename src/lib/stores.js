import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const uid = writable(browser && (localStorage.getItem("cars_id") || 2));
export const afterSubmit = writable({});

const json = browser && localStorage.getItem("cars");
let storedCars = json ? JSON.parse(json) : null;

export const cars = writable(storedCars || [
    {
        uid: 1,
        brand: "AUDI",
        model: "A6",
        year: 2015,
        avatar: ""
    }
]);

cars.subscribe((val) => browser && (localStorage.cars = JSON.stringify(val)));
uid.subscribe((val) => browser && (localStorage.cars_id = val));