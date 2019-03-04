import MessageBoardAPI, { commentData } from '../MessageBoardAPI.js';

class MessageBoardApp extends HTMLElement {
  constructor() {
    super();

    this.api = new MessageBoardAPI(commentData);
    this.state = {
      comments: [],
      loading: true,
    };

    // event listeners
    this.addEventListener('removeComment', this.handleRemoveComment);

    this.addEventListener('updateComment', this.handleUpdateComment);
  }

  // setState({comments: updated comments})
  // for each piece of state
  setState(newState) {
    Object.keys(newState).forEach((key) => {
      // update the correct key
      // this.state.comments =  updatedComments
      this.state[key] = newState[key];
      // select all child elements tracking this piece of state via attributes
      this.querySelectorAll(`[${key}]`).forEach((element) => {
        // sets the attribute
        element[key] = newState[key];
        // element.setAttribute('comments', JSON.stringify(this.state.comments))
      });
    });
  }

  connectedCallback() {
    this.api.getComments().then((comments) => {
      // this.setate({ comments: comments })
      this.setState({ comments });
    });

    // this.load(this.state.loading);
    console.log('RESTART');
    // this.state = {
    //   comments: this.api.getComments()
    //   //comments: this.api.getCommentsSortedByTime()
    // };
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

    this.querySelector('message-board-comment-list').setAttribute(
      'comments',
      JSON.stringify(this.state.comments),
    );

    // add event listeners
    this.querySelector('nav form').addEventListener(
      'submit',
      this.handleSearchSubmit,
    );
    this.querySelector('.add-comment form').addEventListener(
      'submit',
      this.handleAddComment,
    );
    document
      .getElementById('nukeButton')
      .addEventListener('click', this.handleNuke);
  }

  handleSearchSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: false });
    console.log(this.state.loading);

    this.api.load();

    const searchText = new FormData(event.target).get('search');

    const updatedComments = await this.api.filterCommentsByText(searchText);

    this.setState({ comments: updatedComments });
    this.setState({ loading: true });

    console.log(this.state.loading);
  };

  handleAddComment = async (event) => {
    event.preventDefault();
    this.api.load();
    const commentText = new FormData(event.target).get('comment');
    event.target.reset();
    const updatedComments = await this.api.addComment(commentText);
    this.setState({ comments: updatedComments });
  };

  handleRemoveComment = async (event) => {
    console.log(event.detail);
    const confirmed = window.confirm(`Really delete ${event.detail} ?`);
    if (confirmed) {
      const updatedComments = await this.api.removeComment(
        event.target.comment.id,
      );
      this.setState({ comments: updatedComments });
    }
  };

  handleUpdateComment = async (event) => {
    const originalText = event.target.comment.text;

    const text = window.prompt('Type something new: ', originalText);
    if (text != null) {
      const updatedComments = await this.api.updateComment(
        event.target.comment.id,
        text,
      );
      this.setState({ comments: updatedComments });
    }
  };

  // load(temp) {
  //   if (temp) {
  //     document.getElementById("loader").style.display = "block";
  //   } else {
  //     document.getElementById("loader").style.display = "none";
  //   }
  // }

  // handleNuke = event => {
  //   const confirmed = window.confirm(`Do you want to nuke?`);
  //   if (confirmed) {
  //     forEach.comment
  //   }
  // };
}

export default MessageBoardApp;
