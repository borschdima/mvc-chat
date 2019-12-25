export default class Presenter {
    view = null;

    constructor(model) {
        this.model = model;
        this.dbData = this.getData();
    }

    init(view) {
        this.view = view;
    }

    // Return formatted current time (hours:minutes)
    get getTime() {
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${minutes}`;
    }

    //Getting data from Model Component
    getData = () => this.model.getData;

    // Finds a particular contact information from fetched dbdata
    getSpecificChat = id => this.dbData.find(item => item.contactId == id);

    // Last message displayed as a preview in contacts group section being trimmed if necessary
    formatMessageLength = message => {
        let messageToArray = message.split(" ");
        if (messageToArray.length > 15) return messageToArray.slice(0, 10).join(" ") + " ...";
        return message;
    };

    // This function is toggled when we send messages to our contacts
    // It takes our data from DB and insert new information to it. Then gives new data to Model COmponent
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
        // Refresh contact group section to desplay correct last messages in chats
        this.dbData = newData;
        this.view.clearContactsPage();
        this.view.renderContacts(this.dbData);
    };
}
