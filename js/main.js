import MessageBoardApp from "./components/MessageBoardApp.js";
import CommentList from "./components/CommentList.js";
import CommentItem from "./components/CommentItem.js";

customElements.define("message-board-app", MessageBoardApp);
customElements.define("message-board-comment-list", CommentList);
customElements.define("message-board-comment-item", CommentItem);
