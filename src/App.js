import Model from "./MVP/Model";
import View from "./MVP/View";
import Presenter from "./MVP/Presenter";

document.addEventListener("DOMContentLoaded", () => {
    const model = new Model();
    const presenter = new Presenter(model);
    const view = new View(presenter);

    presenter.init(view);
});
