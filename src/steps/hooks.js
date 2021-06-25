var {After, setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(60 * 1000);

After(function(scenario, callback) {
  const world = this;
  browser.takeScreenshot().then(
    function(buffer) {
      world.attach(buffer, 'image/png');
      callback();
    },
    function(err) { callback(err); });
});
