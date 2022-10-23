const express = require('express');

const router = express.Router();

const auth = require('./middlewares/authMiddleware');
const {
  getNodeData,
  putNodeData,
  makePlainObject,
  postNodeData,
  deleteNodeData,
  isPublicNode,
} = require('./middlewares/dataHandlingMiddleware');
const {
  endOfGetNodeReq,
  endOfPutNodeReq,
  endOfPostNodeReq,
  endOfDeleteNodeReq,
} = require('./controllers/nodeController');
const {
  getAllComments,
  createComment,
} = require('./controllers/commentController');

router
  .route('/:nodeId')
  .get(getNodeData, makePlainObject, isPublicNode, auth, endOfGetNodeReq)
  .put(auth, putNodeData, endOfPutNodeReq)
  .post(auth, postNodeData, endOfPostNodeReq)
  .delete(auth, deleteNodeData, endOfDeleteNodeReq);

router.route('/:nodeId/comments').get(getAllComments).post(createComment);

module.exports = router;
