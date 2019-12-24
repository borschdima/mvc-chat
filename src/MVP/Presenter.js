export default class Presenter {
    view = null;

    constructor(model) {
        this.model = model;
        this.dbData = this.getData();
    }

    init(view) {
        this.view = view;
    }

    get getTime() {
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${minutes}`;
    }

    getData = () => this.model.getData;

    getSpecificChat = id => this.dbData.find(item => item.contactId == id);

    formatMessageLength = message => {
        let messageToArray = message.split(" ");
        if (messageToArray.length > 15) return messageToArray.slice(0, 10).join(" ") + " ...";
        return message;
    };

    updateData = (message, chatId) => {
        const newData = this.dbData.map(item => {
            if (item.contactId == chatId) {
                const id = item.messageHistory[item.messageHistory.length - 1].messageId + 1;
                item.messageHistory.push({
                    messageId: id,
                    isMine: true,
                    messageText: message
                });
                return item;
            }
            return item;
        });

        this.model.updateData(newData);
        this.dbData = newData;
        this.view.clearContactsPage();
        this.view.renderContacts(this.dbData);
    };
}
