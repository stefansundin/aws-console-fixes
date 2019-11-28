// https://duckduckgo.com/?q=%22Please+complete+the+form+below+to+download+the%22+site%3Aaws.amazon.com&ia=web
// https://aws.amazon.com/lambda/serverless-architectures-learn-more/
// https://aws.amazon.com/lambda/serverless-architectures-learn-more/dl/
// https://pages.awscloud.com/awsmp_networking_solutionoverview.html
// https://pages.awscloud.com/AWS-ML-in-Action.html
// https://aws.amazon.com/campaigns/migrating-to-the-cloud/
// https://pages.awscloud.com/aware_NAMER_Future-proof-your-business_AWS-IDC1.html
// https://pages.awscloud.com/Accelerating-Product-Development-with-HPC-on-AWS_0913-CMP_OD.html
// https://pages.awscloud.com/NAMER-field-STR-Windows-EOS-Modernize-Applications-eBook-2019-learn.html
// https://pages.awscloud.com/NAMER-field-STR-Deploying-SQL-on-AWS-2019-learn.html
// https://aws.amazon.com/partners/featured/security/shared-responsibility-model/
// https://pages.awscloud.com/NAMER-acq-PWP-palo-alto-networks-May-2019-reg-page.html

(function() {
  var msg = document.querySelector("#msg");
  if (msg) {
    msg.style.display = "block";
  }

  var retURL = document.querySelector("input[name=retURL]");
  if (retURL) {
    var btn = document.createElement("a");
    btn.href = retURL.value;
    var form = retURL.form;
    var submit = form.querySelector("[type=submit]");
    if (submit.textContent.indexOf("Download") != -1) {
      btn.className = submit.className;
      btn.appendChild(document.createTextNode(submit.textContent));
      form.parentNode.replaceChild(btn, form);
    }
    else {
      btn.className = "button btn-size-normal btn-non-block btn-gold";
      btn.appendChild(document.createTextNode("Skip form"));
      form.parentNode.insertBefore(btn, form);
    }
    return;
  }

  var content = document.getElementById("aws-page-content") || document;
  var noscript = content.getElementsByTagName("noscript")[0];
  var form = document.getElementById("whitePaperForm") || content.getElementsByTagName("form")[0];
  if (noscript && form) {
    var htmlString = noscript.innerText;
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    var retURL = doc.querySelector("input[name=ret]");
    if (retURL && retURL.value) {
      var btn = document.createElement("a");
      btn.href = retURL.value;
      btn.className = "button btn-size-normal btn-non-block btn-gold";
      btn.appendChild(document.createTextNode("Skip form"));
      form.insertBefore(btn, form.firstChild);
      return;
    }
  }

  var regBtn = document.getElementById("reg-button") || document.querySelector(".mktoButton");
  var scripts = document.getElementsByTagName("script");
  if (regBtn) {
    for (var i = 0; i < scripts.length; i++) {
      var ret = /location\.href\W*=\W*['"]([^'"]+)['"]/.exec(scripts[i].innerText);
      if (ret != null) {
        var btn = document.createElement("a");
        btn.href = ret[1];
        btn.className = "button btn-size-normal btn-non-block btn-gold";
        btn.style.display = "block";
        btn.style.margin = "1em";
        btn.appendChild(document.createTextNode(regBtn.innerText));
        regBtn.parentNode.insertBefore(btn, regBtn);
        return;
      }
    }
    for (var i = 0; i < scripts.length; i++) {
      var ret = /getYouTubeID\(['"]#youtu\.be\/([^"']+)['"]\)/.exec(scripts[i].innerText);
      if (ret != null) {
        var btn = document.createElement("a");
        btn.href = `https://www.youtube.com/watch?v=${ret[1]}`;
        btn.target = "_blank";
        btn.className = "button btn-size-normal btn-non-block btn-gold";
        btn.style.display = "block";
        btn.style.margin = "1em";
        btn.appendChild(document.createTextNode("Watch Video"));
        form.insertBefore(btn, form.firstChild);
        return;
      }
    }
  }
})();
