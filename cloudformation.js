var templateUrl, filename, focused=false;

function basename(path) {
  return path.replace(/\\/g, '/').replace(/.*\//, '');
}

function esc(str) {
  return str.replace(/'/g, "'\\''");
}

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
      textarea.style.height = "100px";
      textarea.style.resize = "vertical";
      textarea.spellcheck = false;
      textarea.value = "";
      textarea.addEventListener("focus", function() { focused = true; });
      textarea.addEventListener("blur", function() { focused = false; });
      form.parentNode.insertBefore(textarea, form.parentNode.firstChild);
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
      cli += ` --stack-name ${stackName.value}`;
      if (filename) {
        cli += ` --template-body file://${filename}`;
      }
      else if (templateUrl) {
        cli += ` --template-url ${templateUrl}`;
      }
      if (changeSet) {
        cli += ` --change-set-name ${changeSetName.value}`;
        cli += ` --description '${esc(changeSetDescription.value)}'`;
        if (!stackName.disabled) {
          cli += ` --change-set-type CREATE`;
        }
      }
      cli += ` --parameters`;
      var params = form.querySelectorAll("ng-form[name='parameterForm']");
      for (var i=0; i < params.length; i++) {
        var param = params[i];
        var key = param.getElementsByTagName("label")[0].textContent;
        cli += ` \\\n'ParameterKey=${key},`;
        var value = "";

        var repeat = param.querySelectorAll("span[ng-repeat]");
        var dropdown_single = param.getElementsByClassName("ui-select-match-text")[0]; // AWS::EC2::KeyPair::KeyName and  AWS::Route53::HostedZone::Id
        var select = param.getElementsByTagName("select")[0];
        var input = param.getElementsByTagName("input")[0];
        if (repeat.length > 0) {
          var values = [];
          for (var j=0; j < repeat.length; j++) {
            var text = repeat[j].textContent;
            if (re=/(subnet|sg)-[0-9a-f]+/.exec(text)) {
              values.push(re[0]);
            }
          }
          value += values.join(",");
        }
        else if (dropdown_single) {
          value = dropdown_single.textContent.trim();
          if (re=/\((Z[A-Z0-9]{13})\)/.exec(value)) {
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
        cli += `ParameterValue=${esc(value)}'`;
      }

      cli = `# Always review this command (or you are a fool)!\n\n${cli}`;
      if (cli != textarea.value) {
        textarea.value = cli;
      }
    }
  }
}, 300);
