function endOfGetNodeReq(req, res, next) {
  if (res.locals.nodesPlainObject) {
    const responseBody = {};

    responseBody.result = 'ok';
    responseBody.node = res.locals.nodesPlainObject;
    responseBody.count = Object.keys(responseBody.node).length;

    res.status(200).json(responseBody);
    return;
  }

  const error = new Error(
    'Error : no plain object transferred in function endOfGetNodeReq of nodeController.js',
  );
  error.status = 500;
  next(error);
}

function endOfPutNodeReq(req, res, next) {
  if (res.locals.updatedNode) {
    const responseBody = {};

    responseBody.result = 'ok';
    responseBody.node = res.locals.updatedNode;

    res.status(200).json(responseBody);
    return;
  }

  const error = new Error(
    'Error : no processed data transferred in function endOfPutNodeReq of nodeController.js',
  );
  error.status = 500;
  next(error);
}

function endOfPostNodeReq(req, res, next) {
  if (res.locals.createdNode) {
    const responseBody = {};

    responseBody.result = 'ok';
    responseBody.node = res.locals.createdNode;

    res.status(201).json(responseBody);
    return;
  }
  const error = new Error(
    'Error: no processed data transferred in function endOfPostNodeReq of nodeController.js',
  );
  error.status = 500;
  next(error);
}

module.exports = {
  endOfGetNodeReq,
  endOfPutNodeReq,
  endOfPostNodeReq,
};
