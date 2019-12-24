import { db } from "./data";

export default class Model {
    constructor() {
        this.chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
    }

    get getData() {
        return this.chatInfo ? this.chatInfo : db;
    }

    updateData = newData => {
        localStorage.setItem("chatInfo", JSON.stringify(newData));
    };
}
