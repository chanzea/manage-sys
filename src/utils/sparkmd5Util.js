let SparkMD5 = require('spark-md5');

module.exports = function (file, cb) {
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var chunkSize = 1000 * 1000 * 30;
  var chunks = Math.ceil(file.size / chunkSize);
  var currentChunk = 0;
  var spark = new SparkMD5.ArrayBuffer();
  var reader = new FileReader();

  loadNext();

  reader.onloadend = function (e) {
    spark.append(e.target.result); // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      cb(null, spark.end());
    }
  };

  reader.onerror = function () {
    cb('oops, something went wrong.');
  };

  function loadNext () {
    var start = currentChunk * chunkSize;
    var end = start + chunkSize >= file.size ? file.size : start + chunkSize;

    reader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
};
