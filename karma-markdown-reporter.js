var os = require('os');
var path = require('path');
var fs = require('fs');

var MarkdownReporter = function(baseReporterDecorator, config, emitter, logger, helper, formatError) {
  var outputFile = config.htmlReporter.outputFile;
  var pageTitle = config.htmlReporter.pageTitle || 'Unit Test Results';
  var subPageTitle = config.htmlReporter.subPageTitle || false;
  var groupSuites = config.htmlReporter.groupSuites || false;
  var useLegacyStyle = config.htmlReporter.useLegacyStyle || false;
  var useCompactStyle = config.htmlReporter.useCompactStyle || false;
  var log = logger.create('reporter.html');

  var lines = [];
  var results = [];

  baseReporterDecorator(this);

  // this.adapters = [function(msg) {
  //   allMessages.push(msg);
  // }];

  this.onRunStart = function(browsers) {
    browsers.forEach(x => lines.push(x.id));
  };

  this.onBrowserStart = function(browser) {
    var name = JSON.stringify(browser.name);
    lines.push(`onBrowserStart - id: ${browser.id}, name: ${name}`);
  };

  this.onBrowserError = function(browser, error) {
    var name = JSON.stringify(browser.name);
    lines.push(`onBrowserError - id: ${browser.id}, name: ${name}, error: ${error}`);
  };

  this.onBrowserComplete = function(browser) {
    var result = browser.lastResult;

    lines.push(`onBrowserComplete - ${browser.id}`);
    lines.push(`  disconnected: ${result.disconnected}`);
    lines.push(`  error: ${result.error}`);
    lines.push(`  total: ${result.total}`);
    lines.push(`  failed: ${result.failed}`);
    lines.push(`  skipped: ${result.skipped}`);
    lines.push(`  netTime: ${result.netTime}`);
  };

  this.onRunComplete = function(browsers) {

    browsers.forEach(x => {
      lines.push(`onRunComplete - id: ${x.id}, name: ${x.name}`);
    });
  };

  // probably sort by suite, id
  var gotSpec = function(type, browser, result) {
    result.suite.forEach(suite => {
      var myResult = {
        type: type,
        browserId: browser.id,
        suite: suite,
        id: result.id,
        description: result.description,
        time: result.time,
        log: result.log
      };
      results.push(myResult);
    });

    lines.push(`${type} (${browser.id}): ${result}`);
    lines.push('result: ' + JSON.stringify(result, null, 2));
  }

  this.specSuccess = (b, r) => { gotSpec('passed', b, r); };
  this.specSkipped = (b, r) => { gotSpec('skipped', b, r); };
  this.specFailure = (b, r) => { gotSpec('failed', b, r); };

  // values:
  // suite (currentSuite.concat()?)
  // currentSuite[0]?
  // skipped
  // success
  // time
  // description
  // log (for formatting error, is array
  //
  // specClass is created - 'skip', 'pass', 'fail' (failed is if not success and not skipped)
  // specStatus is created - 'Skipped', 'Passed in ${time} s', 'Failed'
  //
  /* SAMPLE:
    result: {
      "description": "should create the app",
      "id": "spec0",
      "log": [],
      "skipped": false,
      "success": true,
      "suite": [
        "App: AngularCliStarter"
      ],
      "time": 192,
      "executedExpectationsCount": 1
    }
*/

  /**
   * Clean string so markdown will look good.  It's not that important to clean
   * everything I don't think, but * and _ to keep the formatting to look
   * similar.
   */
  var clean = function(s) {
    // escape * and _ with backslashes
    s = s.replace('*', '\*');
    s = s.replace('_', '\_');
    return s;
  }

  /**
   * Output results on exit
   */
  this.onExit = function (done) {
    lines.push(`onExit!`);
    fs.writeFileSync('./test_lines.md', lines.join('\r\n'));

    results.sort((a, b) => {
      if (a.spec < b.spec) return -1;
      if (b.spec < a.spec) return 1;
      if (a.id < b.id) return -1;
      if (b.id < a.id) return 1;
      return 0;
    });

    var bytype = { passed: [], failed: [], skipped: [] };
    var bysuite = {};

    var resultLines = [];
    results.forEach(result => {
      bytype[result.type].push(result);
      if (!bysuite[result.suite]) bysuite[result.suite] = [];
      bysuite[result.suite].push(result);
      //resultLines.push(`${result.type} in ${result.time} ms: ${result.suite} - ${result.description}`);
    });

    var passed = bytype.passed.length;
    var failed = bytype.failed.length;
    var skipped = bytype.skipped.length;
    var total = passed + failed + skipped;

    if (passed == total) {
      resultLines.push(`## All Tests Succeeded`);
    } else if (skipped == 0) {
      resultLines.push(`## ${failed}/${total} Tests Failed!`);
    } else {
      resultLines.push(`## ${failed}/${total} Tests Failed! (${skipped} skipped)`);
    }

    resultLines.push('');

    var keys = Object.keys(bysuite);
    keys.sort();
    keys.forEach(key => {
      // TODO: Alter to list x/x failed or passed?
      resultLines.push('* ' + clean(key));
      bysuite[key].forEach(result => {
        var c = clean(result.description);
        var t = `${result.time}`;
        if (result.type == 'skipped') {
          resultLines.push(`  * _skipped - ${c}_`);
        } else if (result.type == 'passed') {
          resultLines.push(`  * _${t} ms - ${c}_`)
        } else {
          resultLines.push(`  * **FAILED** _${t} ms - ${c}_`)
        }
      });
    });

    /* SAMPLE:

      ## All Tests Succeeded

      ## 1/4 Tests Failed (2 skipped)

      * App: AngularCliStarter
        * _205 ms - should create the app_
        * _93 ms - should have as title 'app works!'_
        * _81 ms - should render title in a h1 tag_
        * **FAILED** _70ms - should render SharedComponent in a h2 tag_
    */

    fs.writeFileSync('./test_results.md', resultLines.join('\r\n'));
    done();
  };
};

MarkdownReporter.prototype._repeat = function(n, str) {
  var res = [];
  var i;
  for (i = 0; i < n; ++i) {
    res.push(str);
  }
  return res.join('');
};

MarkdownReporter.$inject = ['baseReporterDecorator', 'config', 'emitter', 'logger', 'helper', 'formatError'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:markdown': ['type', MarkdownReporter]
};
