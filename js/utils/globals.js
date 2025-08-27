// js/utils/globals.js
let currentUserValue = null;
let selectedStoreIdValue = null;

export function setCurrentUser(user) {
    currentUserValue = user;
}

export function setSelectedStoreId(storeId) {
    selectedStoreIdValue = storeId;
}

export function getCurrentUser() {
    return currentUserValue;
}

export function getSelectedStoreId() {
    return selectedStoreIdValue;
}