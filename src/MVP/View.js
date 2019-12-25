import "../css/flatpickr.min.scss";
import "../css/dark.scss";
import flatpickr from "flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru.js";

import "../css/style.scss";

export default class View {
    messanger = document.querySelector(".messanger");
    chat = document.querySelector(".messanger .messanger__chat");
    chatBody = document.querySelector(".messanger .messanger__chat .chat__body");
    newMessage = document.querySelector("#newMessage");
    filterDialogs = document.querySelector("#filterDialogs");
    btnSendMessage = document.querySelector(".btn.btn-send");
    contacts = document.querySelector(".messanger .contacts");
    chatHeader = document.querySelector(".messanger .chat__header");
    headerContactWrapper = document.querySelector(".messanger .chat__header .selected-contact__wrapper");
    flatpickrField = document.querySelector("#flatpickr");

    dbData = null;

    constructor(presenter) {
        this.presenter = presenter;

        this.init();
    }

    init = () => {
        this.dbData = this.presenter.dbData;
        this.setWindowHeight();
        this.renderContacts(this.dbData);
        this.renderChat(this.dbData[0]);
        this.eventHandler();
        flatpickr(".flatpickr", {
            disableMobile: "true",
            locale: Russian,
            dateFormat: "d.m.Y",
            wrap: true
        });
    };

    setWindowHeight = () => {
        const vh = window.innerHeight * 0.01;
        this.messanger.style.setProperty("--vh", `${vh}px`);
    };

    eventHandler = () => {
        this.messanger.addEventListener("click", this.messangerClickHandler);
        this.chat.addEventListener("click", this.chatClickHandler);
        this.btnSendMessage.addEventListener("click", this.newMessageClickHandler);
        this.newMessage.addEventListener("keyup", this.newMessageInputHandler);
        this.filterDialogs.addEventListener("keyup", this.filterHandler);
        window.addEventListener("resize", this.setWindowHeight);
    };

    renderContacts = dbData => {
        const data = dbData;

        data.forEach(item => {
            const template = this.contactRenderTemplate(item);

            this.contacts.insertAdjacentHTML("beforeend", template);
        });
    };

    renderChat = dbData => {
        const item = dbData;
        const contactTemplate = this.contactRenderTemplate(item, true);
        this.headerContactWrapper.insertAdjacentHTML("beforeend", contactTemplate);

        const messages = item.messageHistory;
        messages.forEach(({ isMine, messageText, messageTime = this.presenter.getTime }) => {
            const isMineClass = isMine ? "chat__messaage--mine" : "";
            const messageTemplete = `
                <div class="chat__messaage ${isMineClass} d-flex flex-column my-2 p-3">
                    <div class="message__text">${messageText}</div>
                    <div class="message__time">${messageTime}</div>
                </div>
            `;
            this.chatBody.insertAdjacentHTML("beforeend", messageTemplete);
        });
    };

    clearChatPage = () => {
        this.chatHeader.querySelector(".contacts__item").remove();
        const oldMessages = this.chatBody.querySelectorAll(".chat__messaage");
        [].slice.call(oldMessages).forEach(message => message.remove());
    };

    clearContactsPage = () => {
        const oldContacts = this.contacts.querySelectorAll(".contacts__item");
        const oldSeparators = this.contacts.querySelectorAll(".separator");
        [].slice.call(oldSeparators).forEach(separator => separator.remove());
        [].slice.call(oldContacts).forEach(contact => contact.remove());
    };

    filterHandler = e => {
        const value = e.target.value.toLowerCase();
        const allContacts = this.contacts.querySelectorAll(".contacts__item");
        [].slice.call(allContacts).forEach(contact => {
            const contactName = contact.querySelector(".contacts__item-name").textContent.toLowerCase();
            if (contactName.includes(value)) {
                contact.classList.remove("d-none");
                contact.nextElementSibling.classList.remove("d-none");
            } else {
                contact.classList.add("d-none");
                contact.nextElementSibling.classList.add("d-none");
            }
        });
    };

    newMessageInputHandler = e => {
        if (e.keyCode == 13) {
            this.newMessageClickHandler();
        }
    };

    newMessageClickHandler = () => {
        const message = this.newMessage.value;
        if (message) {
            const time = this.presenter.getTime;
            const template = `
                <div class="chat__messaage chat__messaage--mine my-2 p-3">
                    <div class="message__text">${message}</div>
                    <div class="message__time">${time}</div>
                </div>
            `;
            this.chatBody.insertAdjacentHTML("beforeend", template);
            this.chatBody.scrollTop = document.body.scrollHeight;
            this.newMessage.value = "";

            const chatId = this.chatHeader.querySelector(".contacts__item").dataset.id;
            this.presenter.updateData(message, chatId);
        }
    };

    messangerClickHandler = e => {
        if (e.target.closest(".contacts__item")) {
            this.chat.classList.add("messanger__chat--open");
            const chatId = e.target.closest(".contacts__item").dataset.id;
            const chatData = this.presenter.getSpecificChat(chatId);
            this.clearChatPage();
            this.renderChat(chatData);
        }
    };

    chatClickHandler = e => {
        if (e.target.closest(".chat__close")) {
            this.chat.classList.remove("messanger__chat--open");
        }
    };

    contactRenderTemplate = (contact, header = false) => {
        const { messageHistory, contactId, contactAvatar, contactName } = contact;
        let { messageText, isMine } = messageHistory[messageHistory.length - 1];
        messageText = this.presenter.formatMessageLength(messageText);

        let messageTemplate = isMine ? `<span>Вы: </span>${messageText}` : messageText;
        let darkNameClass = "";
        let separator = `<div class="separator my-1 d-flex"></div>`;

        if (header) {
            messageTemplate = "Online";
            darkNameClass += "contacts__item-name--dark";
            separator = "";
        }
        return `
            <div class="contacts__item d-flex p-2" data-id="${contactId}">
                <div class="contacts__item-logo" style="background-image: url(${contactAvatar});"></div>
                <div class="contacts__item-text d-flex flex-column justify-content-center">
                    <div class="contacts__item-name ${darkNameClass}">${contactName}</div>
                    <div class="contacts__item-message">${messageTemplate}</div>
                </div>
            </div>
            ${separator}
        `;
    };
}
