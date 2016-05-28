(function($, undefined) {
  var $input = $("#DirectoryInput");
  var $btnCalculate = $("#CalculateLinks");
  var $LinkList = $(".LinkList");
  var $btnCopy = $("#Copy");
  var $msgs = $(".msg");

  var clipboard = new Clipboard('#Copy', function() {
    var copyValue = "";
    resetMessages();
    $.each($LinkList.children(), {
      text: function(index, item) {
              copyValue.concat($(item).text(), "\r\n");
            }
    });

    return copyValue;
  });

  clipboard.on('success', function(e) {
    $msgs.filter(".msg--success").removeAttr("data-hidden");
    window.setTimeout(resetMessages, 3000);
  });

  clipboard.on("error", function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });

  $btnCalculate.on("click.createLinks", function(e) {
    e.preventDefault();
    createLinks($input.val());
  });

  function createLinks(inputData) {
    var lines = inputData.split("\n");
    var links = [];
    $.each(lines, function(i, line) {
      line = line.trim();
      if (line === "") {
        return;
      }

      links.push(parseLine(line));
    });

    if (links.length <= 0) {
      return;
    }

    displayLinks(links);
  }

  function parseLine(line) {
    var splitLine = line.split("/media/");
    var cdnUrl = "https://cdn.ramseysolutions.net/media/";

    if (splitLine.length <= 1) {
      return;
    }

    return cdnUrl + splitLine[1];
  }

  function displayLinks(links) {
    var linkTemplate = "<a target=\"_blank\" href=\"{{link}}\">{{link}}</a><br/>";
    $btnCopy.removeAttr("data-hidden");
    resetMessages();
    $LinkList.empty();

    $.each(links, function(i, link) {
      $LinkList.append(linkTemplate.replace(/{{link}}/gi, link));
    });
  }

  function resetMessages() {
    $msgs.each(function() {
      $(this).attr("data-hidden", "");
    });
  }
}(jQuery));
