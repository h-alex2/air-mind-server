const Node = require('../../models/Node');
const MindMap = require('../../models/MindMap');

const nodeDeleteHelper = require('../lib/nodeDeleteHelper');

const getNodeData = async (req, res, next) => {
  try {
    const { nodeId } = req.params;
    res.locals.nodesNestedObject = await Node.findById(nodeId).setOptions({
      autopopulate: { maxDepth: 5 },
    });

    next();
  } catch (error) {
    error.message = `Error during getting nodes in function getNodeData of dataHandlingMiddleware.js : ${error.message}`;

    next(error);
  }
};

const putNodeData = async (req, res, next) => {
  try {
    const { nodeId } = req.params;

    if (res.req.files) {
      const images = res.req.files;

      const updatedNode = await Node.findById(nodeId);

      if (updatedNode.images.length > 10) {
        const error = new Error(
          'The maximum number of images has been exceeded.',
        );
        error.status = 400;
        next(error);
        return;
      }

      images.forEach(async image => {
        const imageData = {
          path: image.path,
          originalName: image.originalname,
        };

        try {
          updatedNode.images.push(imageData);
          await updatedNode.save();
        } catch (error) {
          // TODO: 여러 개 넣을 때 에러남, 근데 저장은 됨. 개선 필요
        }
      });

      res.locals.updatedNode = updatedNode;

      next();
    }
    const node = req.body;

    const updatedNode = await Node.findByIdAndUpdate(nodeId, node, {
      returnOriginal: false,
    });
    res.locals.updatedNode = updatedNode;

    next();
  } catch (error) {
    error.message = `Error during putting node in function putNodeData of dataHandlingMiddleware.js : ${error.message}`;

    next(error);
  }
};

const postNodeData = async (req, res, next) => {
  try {
    const { nodeId } = req.params;

    const parentNode = await Node.findById(nodeId);
    const childNode = await Node.create(req.body);

    if (!parentNode) {
      throw new Error('No parent node error!!');
    }

    childNode.mindMap = parentNode.mindmap;
    childNode.parent = parentNode.id;
    parentNode.children.push(childNode.id);

    await childNode.save();
    await parentNode.save();

    res.locals.childNode = childNode;
    next();
  } catch (error) {
    error.message = `Error during creating node in function postNodeData of dataHandlingMiddleware.js${error.message}`;

    next(error);
  }
};

const deleteNodeData = async (req, res, next) => {
  try {
    const { nodeId } = req.params;

    const deleteTarget = await nodeDeleteHelper(nodeId);

    await Node.deleteMany({ _id: deleteTarget });

    next();
  } catch (error) {
    error.message = `Error during deleting node in function deleteNodeData of dataHandlingMiddleware.js${error.message}`;

    next(error);
  }
};

const postHeadNodeData = async (req, res, next) => {
  try {
    const { mindMap } = res.locals;
    const childNode = await Node.create({
      attribute: {
        cordX: 500,
        cordY: 300,
      },
    });

    if (!mindMap) {
      throw new Error('No mind map error!!');
    }

    childNode.mindMap = mindMap.id;
    mindMap.headNode = childNode.id;

    await childNode.save();
    await mindMap.save();

    res.locals.childNode = childNode;
    next();
  } catch (error) {
    error.message = `Error during creating node in function postHeadNodeData of dataHandlingMiddleware.js${error.message}`;

    next(error);
  }
};

const makePlainObject = (req, res, next) => {
  try {
    if (!res.locals.nodesNestedObject) {
      const error = new Error('No node data available!');
      throw error;
    }

    const nestedObjectQueue = [res.locals.nodesNestedObject];
    const plainObject = {};
    let nodeCount = req.query.max || 30;

    while (nestedObjectQueue.length > 0 && nodeCount > 0) {
      const tempObject = nestedObjectQueue.shift();

      if (tempObject.children) {
        nestedObjectQueue.push(...tempObject.children);

        tempObject.children = tempObject.children.map(child => child.id);
      }

      plainObject[tempObject.id] = tempObject;

      nodeCount -= 1;
    }

    res.locals.nodesPlainObject = plainObject;

    const responseBody = {};

    responseBody.result = 'ok';
    responseBody.node = res.locals.nodesPlainObject;
    responseBody.count = Object.keys(responseBody.node).length;

    res.status(200).json(responseBody);

    next();
  } catch (error) {
    error.message = `Error during making plain object in function makePlainObject of dataHandlingMiddleware.js : ${error.message}`;

    next(error);
  }
};

const getMindMapData = async (req, res, next) => {
  try {
    const { mindMapId } = req.params;

    res.locals.mindMap = await MindMap.findById(mindMapId).populate();

    next();
  } catch (error) {
    error.message = `Error during getting mindmap in function getMindMapData of dataHandlingMiddleware.js : ${error.message}`;

    next(error);
  }
};

const putMindMapData = async (req, res, next) => {
  try {
    const { mindMapId } = req.params;
    const mindMap = req.body;

    const updatedMindMap = await MindMap.findByIdAndUpdate(mindMapId, mindMap, {
      returnOriginal: false,
    });
    res.locals.mindMapData = updatedMindMap;

    next();
  } catch (error) {
    error.message = `Error during putting mindmap in function putMindMapData of dataHandlingMiddleware.js : ${error.message}`;

    next(error);
  }
};

const postMindMapData = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const mindMap = await MindMap.create({
      author: userId,
      access: 'private',
    });

    res.locals.mindMap = mindMap;

    next();
  } catch (error) {
    error.message = `Error during posting mindmap in function postMindMapData of dataHandlingMiddleware.js : ${error.message}`;

    next(error);
  }
};

const deleteMindMapData = async (req, res, next) => {
  try {
    const { mindMapId } = req.params;

    await Node.deleteMany({ mindMap: mindMapId });
    await MindMap.deleteOne({ _id: mindMapId });

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getMindMapAccessData = async (req, res, next) => {
  try {
    const { mindMapId } = req.params;

    const mindMap = await MindMap.findById(mindMapId).populate('author');

    res.locals.mindMap = mindMap;
    res.locals.access = mindMap.access;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getMyMindMapList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const max = req.query.max || 15;
    const access =
      req.query.access === 'mixed'
        ? ['public', 'private']
        : req.query.access || 'public';

    res.locals.mindMapsList = await MindMap.find({
      author: userId,
      access,
    })
      .sort({ date: -1 })
      .limit(max)
      .populate('author');

    next();
  } catch (error) {
    error.message = `Error during getting mindMaps in dataHandlingMiddleware.js : ${error.message}`;
    next(error);
  }
};

const getPublicMindMapList = async (req, res, next) => {
  try {
    const max = req.query.max || 15;
    res.locals.mindMapsList = await MindMap.find({ access: 'public' })
      .sort({ date: -1 })
      .limit(max)
      .populate('author');

    next();
  } catch (error) {
    error.message = `Error during getting public mindMaps in dataHandlingMiddleware.js : ${error.message}`;
    next(error);
  }
};

const isPublicNode = async (req, res, next) => {
  try {
    const { mindMapId } = res.locals;
    const mindMap = await MindMap.findById(mindMapId);

    if (mindMap.access === 'public') {
      const responseBody = {};

      responseBody.result = 'ok';
      responseBody.node = res.locals.nodesPlainObject;
      responseBody.count = Object.keys(responseBody.node).length;

      res.status(200).json(responseBody);
      return;
    }

    next();
  } catch (error) {
    error.message = `Error during checking if mindMap is public in dataHandlingMiddleware : ${error.message}`;
    next(error);
  }
};

module.exports = {
  getNodeData,
  putNodeData,
  postNodeData,
  deleteNodeData,
  postHeadNodeData,
  makePlainObject,
  getMindMapData,
  putMindMapData,
  postMindMapData,
  deleteMindMapData,
  getMindMapAccessData,
  getMyMindMapList,
  getPublicMindMapList,
  isPublicNode,
};
