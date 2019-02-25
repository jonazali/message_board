import MessageBoardAPI, { commentData } from "../MessageBoardAPI.js";

class MessageBoardApp extends HTMLElement {
  constructor() {
    super();

    this.api = new MessageBoardAPI(commentData);
    this.state = {
      comments: this.api.getAllComments()
      //comments: this.api.getCommentsSortedByTime()
    };

    // event listeners
    this.addEventListener("removeComment", this.handleRemoveComment);

    this.addEventListener("updateComment", this.handleUpdateComment);
  }

  //setState({comments: updated comments})
  // for each piece of state
  setState(newState) {
    Object.keys(newState).forEach(key => {
      //update the correct key
      //this.state.comments =  updatedComments
      this.state[key] = newState[key];
      //select all child elements tracking this piece of state via attributes
      this.querySelectorAll(`[${key}]`).forEach(element => {
        //sets the attribute
        element[key] = newState[key];
        //element.setAttribute('comments', JSON.stringify(this.state.comments))
      });
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <nav>
        <form>
          <input
            type="text"
            name="search"
            placeholder="Search"
          />
          <button type="submit">Search</button>
        </form>
        <button type="button" id="nukeButton">Nuke all Comments</button>
      </nav>
      <message-board-comment-list></message-board-comment-list>
        <div class="add-comment">
          <form>
            <input
              type="text"
              name="comment"
              placeholder="Your opinion here"
            />
            <button type="submit">Comment</button>
          </form>
          
        </div>
    `;

    this.querySelector("message-board-comment-list").setAttribute(
      "comments",
      JSON.stringify(this.state.comments)
    );

    // add event listeners
    this.querySelector("nav form").addEventListener(
      "submit",
      this.handleSearchSubmit
    );
    this.querySelector(".add-comment form").addEventListener(
      "submit",
      this.handleAddComment
    );
    document
      .getElementById("nukeButton")
      .addEventListener("click", this.handleNuke);
  }

  handleSearchSubmit = event => {
    event.preventDefault();

    const searchText = new FormData(event.target).get("search");
    console.log(searchText);
    const updatedComments = this.api.filterCommentsByText(searchText);
    this.setState({ comments: updatedComments });
  };

  handleAddComment = event => {
    event.preventDefault();
    const commentText = new FormData(event.target).get("comment");
    event.target.reset();
    const updatedComments = this.api.addComment(commentText);
    this.setState({ comments: updatedComments });
  };

  handleRemoveComment = event => {
    console.log(event.detail);
    const confirmed = window.confirm(`Really delete ${event.detail} ?`);
    if (confirmed) {
      const updatedComments = this.api.removeComment(event.target.comment.id);
      this.setState({ comments: updatedComments });
    }
  };

  handleUpdateComment = event => {
    const originalText = event.target.comment.text;

    const text = window.prompt("Type something new: ", originalText);
    if (text != null) {
      const updatedComments = this.api.updateComment(
        event.target.comment.id,
        text
      );
      this.setState({ comments: updatedComments });
    }
  };

  // handleNuke = event => {
  //   const confirmed = window.confirm(`Do you want to nuke?`);
  //   if (confirmed) {
  //     forEach.comment
  //   }
  // };
}

export default MessageBoardApp;
