import { db } from "./data";

export default class Model {
    constructor() {
        this.chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
    }

    // Returns data from JSON file if local storage is emty. If not - returns users up to date data
    get getData() {
        return this.chatInfo ? this.chatInfo : db;
    }

    // Recieving new data from Presenter Component and write it to local storage
    updateData = newData => {
        localStorage.setItem("chatInfo", JSON.stringify(newData));
    };
}
