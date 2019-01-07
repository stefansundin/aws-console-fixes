// this script does two things:
// 1. checks the CAPABILITY_IAM checkbox for you
// 2. adds a textarea with the awscli command you can use to create/update the template along with the parameters

// Don't do anything if the new console is enabled
// This file will be removed when the new console becomes the default
if (document.body && !document.body.classList.contains("awsui-mezzanine-overrides")) {

// supply a profile here to use it in the awscli command:
var profile = null;
// var profile = "admin";

var templateUrl, filename, focused=false;

function basename(path) {
  return path.replace(/\\/g, '/').replace(/.*\//, '');
}

function esc(str) {
  return str.replace(/'/g, "'\\''");
}

function esc_value(str) {
  str = esc(str);
  if (str.includes(",")) {
    str = `"${str}"`;
  }
  return str;
}

// this is a function that gets injected into the page in order to read the angular scope.
// it then puts this into DOM attributes, that is then accessible by this content script.
function injected_script() {
  setInterval(function() {
    var form = document.getElementById("frm-wiz-params");
    if (form) {
      var params = form.querySelectorAll("ng-form[name='parameterForm']");
      for (var i=0; i < params.length; i++) {
        var param = params[i];
        if (!param.title) {
          var scope = angular.element(param).scope();
          var text = param.getElementsByTagName("label")[0].textContent;
          if (scope.parameter.parameterKey != text) {
            param.title = scope.parameter.parameterKey;
          }
        }
      }
    }
  }, 1000);
}
// inject the function above in a script tag
var script = document.createElement("script");
script.appendChild(document.createTextNode(`(${injected_script})();`));
(document.body || document.head || document.documentElement).appendChild(script);

setInterval(function() {
  var checkbox = document.querySelector("input[name=CAPABILITY_IAM]");
  if (checkbox && !checkbox.checked) {
    checkbox.click();
  }

  var input_templateUrl = document.querySelector("input[name=templateUrl]");
  var radio_sample = document.querySelector("input[type=radio][value=sample]");
  var radio_upload = document.querySelector("input[type=radio][value=upload]");
  var radio_url = document.querySelector("input[type=radio][value=url]");
  var file = document.querySelector("input[type=file]");
  if (input_templateUrl) {
    filename = templateUrl = "";
    if (radio_upload.checked) {
      filename = basename(file.value);
    }
    else if (radio_url.checked || radio_sample.checked) {
      templateUrl = input_templateUrl.value;
    }
  }

  var form = document.getElementById("frm-wiz-params");
  if (form) {
    var textarea = document.getElementById("awscli-command");
    if (!textarea) {
      var textarea = document.createElement("textarea");
      textarea.id = "awscli-command";
      textarea.style.width = "100%";
      textarea.style.height = "90px";
      textarea.style.resize = "vertical";
      textarea.spellcheck = false;
      textarea.value = "";
      textarea.addEventListener("focus", function() { focused = true; });
      textarea.addEventListener("blur", function() { focused = false; });
      textarea.addEventListener("mouseup", function() {
        // just nudge the resize control downwards a little bit and it will expand
        var height = parseInt(this.style.height, 10);
        if (height > 95 && height < 150) {
          this.style.height = "600px";
        }
      });
      form.parentNode.appendChild(textarea);
    }
    if (!focused) {
      var stackName = form.querySelector("input[name=stackName]");
      var changeSetName = form.querySelector("input[name=changeSetName]");
      var changeSetDescription = form.querySelector("input[name=changeSetDescription]");
      var changeSet = changeSetName && changeSetName.required;

      var cli = `aws cloudformation `;
      if (changeSet) {
        cli += `create-change-set`;
      }
      else {
        cli += `${stackName.disabled?"update":"create"}-stack`;
      }
      if (profile) {
        cli += ` --profile '${profile}'`;
      }
      cli += ` --stack-name '${stackName.value}'`;
      if (filename) {
        cli += ` --template-body 'file://${filename}'`;
      }
      else if (templateUrl) {
        cli += ` --template-url '${templateUrl}'`;
      }
      else {
        cli += ` --use-previous-template`
      }
      if (changeSet) {
        cli += ` --change-set-name '${changeSetName.value}'`;
        cli += ` --description '${esc(changeSetDescription.value)}'`;
        if (!stackName.disabled) {
          cli += ` --change-set-type CREATE`;
        }
      }
      cli += ` --capabilities CAPABILITY_IAM --parameters`;
      var params = form.querySelectorAll("ng-form[name='parameterForm']");
      for (var i=0; i < params.length; i++) {
        var param = params[i];
        var key = param.title || param.getElementsByTagName("label")[0].textContent;
        var value = "";

        var repeat = param.querySelectorAll("span[ng-repeat]");
        var dropdown_single = param.getElementsByClassName("ui-select-match-text")[0]; // AWS::EC2::KeyPair::KeyName and AWS::Route53::HostedZone::Id
        var select = param.getElementsByTagName("select")[0];
        var input = param.getElementsByTagName("input")[0];

        if (input && input.disabled) {
          // "Use existing value" checkbox is checked
          continue;
        }

        if (repeat.length > 0) {
          var values = [];
          for (var j=0; j < repeat.length; j++) {
            var text = repeat[j].textContent;
            if (re=/(subnet|sg|vpc)-[0-9a-f]+/.exec(text)) {
              values.push(re[0]);
            }
          }
          value += values.join(",");
        }
        else if (dropdown_single) {
          value = dropdown_single.textContent.trim();
          if (re=/(subnet|sg|vpc)-[0-9a-f]+/.exec(value)) {
            value = re[0];
          }
          else if (re=/\((Z[A-Z0-9]{10,15})\)/.exec(value)) {
            value = re[1];
          }
        }
        else if (select) {
          value = select.getElementsByTagName("option")[select.selectedIndex].textContent;
        }
        else if (input) {
          value = input.value;
        }
        // else debugger;
        cli += ` \\\n  'ParameterKey=${key},ParameterValue=${esc_value(value)}'`;
      }

      var value = `
# Always review this command before you run it!!
# Note: This feature in aws-console-fixes will go away when the new CloudFormation
# console becomes the default, since I am not using CloudFormation anymore.

${cli}
`.trimLeft();
      if (value != textarea.value) {
        textarea.value = value;
      }
    }
  }
}, 300);

}
