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
    'Error : no plain object transferred in nodeController.js',
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
    'Error : no processed data transferred in nodeController.js',
  );
  error.status = 500;
  next(error);
}

module.exports = {
  endOfGetNodeReq,
  endOfPutNodeReq,
};
