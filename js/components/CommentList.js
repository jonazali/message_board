export default class CommentList extends HTMLElement {
  static get observedAttributes() {
    return ["comments"];
  }
  //this.comments

  //JSON.parse(this.getAttribute('comments')); too repetitive

  get comments() {
    if (this.hasAttribute("comments")) {
      return JSON.parse(this.getAttribute("comments"));
    }
    return [];
  }

  //avoid using..asd
  //this.comments = "new comment"
  //
  set comments(val) {
    this.setAttribute("comments", JSON.stringify(val));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = "";
    this.comments.forEach(comment => {
      //create a comment-list element
      const newComment = document.createElement("message-board-comment-item");
      //set it comment attribute
      // newComment.setAttribute("comment", JSON.stringify(comment));
      newComment.comment = comment;
      //append it to the comment list
      this.append(newComment);
    });
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render();
  }
}
