// Just disable the free tier checkbox by default.
// ProTip: You can bookmark this URL to start with us-west-2 selected: https://calculator.s3.amazonaws.com/index.html#r=PDX
// You can also select a service by default, e.g.: #r=PDX&s=S3
// Regions: IAD, CMH, PDX, SFO, YUL, DUB, LHR, FRA, SIN, NRT, SYD, ICN, BOM, GRU, PDT, CDG
// Services: EC2, S3, Route53, CloudFront, RDS, DynamoDB, ElastiCache, CloudWatch, SES, SNS, ElasticTranscoder, WorkSpaces, Zocalo (WorkDocs), DirectoryService, Redshift, Glacier, SQS, SWF, EMR, Kinesis, CloudSearch, Snowball, DirectConnect, VPN, SimpleDB, PremiumSupport

var timer = setInterval(function() {
  var free_tier = document.querySelector('.freeTierPanel input[type="checkbox"]');
  if (free_tier && free_tier.checked) {
    clearInterval(timer);
    free_tier.click();
  }
}, 200);
