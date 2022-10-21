const endOfMindMapListReq = async (req, res, next) => {
  if (res.locals.mindMapsList) {
    const responseBody = {};

    responseBody.result = 'ok';
    responseBody.mindMap = res.locals.mindMapsList;
    responseBody.count = res.locals.mindMapsList.length;

    res.status(200).json(responseBody);
    return;
  }

  const error = new Error(
    'Error : no list transferred in mindMapController.js',
  );
  error.status = 500;
  next(error);
};

const endOfMindMapReq = (req, res, next) => {
  try {
    const responseBody = {
      result: 'ok',
      mindMap: res.locals.mindMap,
    };

    res.status(200).json(responseBody);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const endOfPostMindMapReq = (req, res, next) => {
  try {
    const responseBody = {
      result: 'ok',
      mindMap: res.locals.mindMap,
      node: res.locals.childNode,
    };

    res.status(200).json(responseBody);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const endOfDeleteMindMapReq = (req, res, next) => {
  try {
    res.status(204).json({ result: 'ok' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  endOfMindMapListReq,
  endOfMindMapReq,
  endOfPostMindMapReq,
  endOfDeleteMindMapReq,
};
