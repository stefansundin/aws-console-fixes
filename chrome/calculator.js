// Disables the free tier checkbox by default (except if loading a saved calculation).
// Removes "Amazon" and "AWS" prefixes in the services list.
//
// ProTip: You can bookmark this URL to start with us-west-2 selected: https://calculator.s3.amazonaws.com/index.html#r=PDX
// You can also select a service by default, e.g.: #r=PDX&s=S3
// Regions: IAD, CMH, PDX, SFO, YUL, DUB, LHR, FRA, SIN, NRT, SYD, ICN, BOM, GRU, PDT, CDG
// Services: EC2, S3, Route53, CloudFront, RDS, DynamoDB, ElastiCache, CloudWatch, SES, SNS, ElasticTranscoder, WorkSpaces, Zocalo (WorkDocs), DirectoryService, Redshift, Glacier, SQS, SWF, EMR, Kinesis, CloudSearch, Snowball, DirectConnect, VPN, SimpleDB, PremiumSupport

if (!window.location.hash.includes("key=")) {
  var timer1 = setInterval(function() {
    var free_tier = document.querySelector('.freeTierPanel input[type="checkbox"]');
    if (free_tier) {
      clearInterval(timer1);
      if (free_tier.checked) {
        free_tier.click();
      }
    }
  }, 200);
}

// We have to let this timer around since changing the region will repopulate the list.
// Curiously enough, the DOM elements are saved somewhere since when going back to the region again, the prefixes are still removed, so perhaps this can be done better somehow.
var timer2 = setInterval(function() {
  var services = document.querySelectorAll('.servicesPanel .tab');
  for (var i=0; i < services.length; i++) {
    var service = services[i];
    if (service.innerText.startsWith("Amazon ")) {
      service.innerText = service.innerText.substr("Amazon ".length);
    }
    else if (service.innerText.startsWith("AWS ")) {
      service.innerText = service.innerText.substr("AWS ".length);
    }
  }
}, 200);
