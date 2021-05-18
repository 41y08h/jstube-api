import comment from "./comment";
import edit from "./edit";
import getAll from "./getAll";
import getAllReplies from "./getAllReplies";
import remove from "./remove";
import reply from "./reply";

const CommentsController = {
  comment,
  remove,
  getAll,
  edit,
  reply,
  getAllReplies,
};

export default CommentsController;
