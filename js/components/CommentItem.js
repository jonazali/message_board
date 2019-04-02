export default class CommentItem extends HTMLElement {
  get comment() {
    if (this.hasAttribute("comment")) {
      return JSON.parse(this.getAttribute("comment"));
    }
    return {
      timestamp: Date.now,
      text: "",
      author: -1
    };
  }

  set comment(val) {
    this.setAttribute("comment", JSON.stringify(val));
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <p>${this.comment.text}</p>
      <button type="button" class="delete-button">x</button>
      <button type="button" class="update-button">Edit</button>
    `;

    // create a custom event and emit it
    this.querySelector("button.delete-button").addEventListener("click", () => this.dispatchRemoveEvent(this.removeEvent));

    // create the edit event
    this.querySelector("button.update-button").addEventListener("click", () => this.dispatchUpdateEvent(this.editEvent));
  }

  dispatchRemoveEvent = () => {
    this.dispatchEvent(
      new CustomEvent("removeComment", {
        bubbles: true,
        detail: this.comment.text
      })
    );
  };

  dispatchUpdateEvent = () => {
    this.dispatchEvent(
      new CustomEvent("updateComment", {
        bubbles: true,
        detail: this.comment.text
      })
    );
  };
}
