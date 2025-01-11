module.exports = {
  get(req, res) {
    res.json({
      message: 'Hello from Next-Lite API!',
      timestamp: new Date().toISOString(),
      query: req.query
    });
  },

  post(req, res) {
    res.json({
      message: 'Received POST request',
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }
};
