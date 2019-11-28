// Disable spellcheck on input fields.
// Add a ton of icons.

setInterval(function() {
  // Some input fields are created dynamically, which is why an interval is required
  document.querySelectorAll("input[type='text'],textarea").forEach(function(ta){
    ta.spellcheck = false;
  });
}, 1000);

function add_icon(title, name) {
  var a = document.querySelector(`#service_select_menu a[title="${title}"]`);
  if (!a) {
    console.log(`Could not find ${title}`)
    return;
  }
  var i = a.parentElement.querySelector("i.service-icon");
  if (!i.classList.contains("aws")) {
    // skip if an icon has been added to this service since this code was written
    console.log(`Skipping adding icon to ${title}`, i);
    return;
  }
  i.classList.remove("aws");
  i.classList.add(name);
}

var timer = setInterval(function() {
  // wait until dropdown is populated
  if (!document.querySelector(`#service_select_menu td`)) return;
  clearInterval(timer);

  add_icon("Amazon API Gateway", "api_gateway");
  add_icon("Application Discovery", "application_discovery");
  add_icon("Amazon Athena", "athena");
  add_icon("Amazon EC2 Auto Scaling", "autoscaling");
  add_icon("AWS Batch", "batch");
  add_icon("AWS Certificate Manager", "acm");
  add_icon("AWS Certificate Manager Private Certificate Authority", "acm");
  add_icon("Amazon Chime", "chime");
  add_icon("AWS CloudHSM", "cloudhsm");
  add_icon("AWS CodeBuild", "codebuild");

  add_icon("AWS CodeCommit", "codecommit");
  add_icon("AWS CodeDeploy", "codedeploy");
  add_icon("AWS CodePipeline", "codepipeline");
  add_icon("AWS CodeStar", "codestar");
  add_icon("AWS CodeStar Notifications", "codestar");
  add_icon("Amazon Cognito Identity", "cognito");
  add_icon("Amazon Cognito Sync", "cognito");
  add_icon("Amazon Cognito User Pools", "cognito");
  add_icon("AWS Config", "config");
  add_icon("Amazon Connect", "connect");
  add_icon("Data Pipeline", "datapipeline");
  add_icon("AWS Database Migration Service", "dms");
  add_icon("AWS Device Farm", "device_farm");
  add_icon("Amazon Elastic Container Registry", "ecr");
  add_icon("Amazon Elastic Container Service", "ecs");
  add_icon("Amazon Elastic Container Service for Kubernetes", "eks");
  add_icon("Amazon Elastic File System", "efs");

  add_icon("Amazon Elasticsearch Service", "elasticsearch");
  add_icon("Amazon GameLift", "gamelift");
  add_icon("AWS Glue", "glue");
  add_icon("AWS Import Export Disk Service", "import_export");
  add_icon("Amazon Inspector", "inspector");
  add_icon("AWS IoT", "iot");
  add_icon("AWS IoT Greengrass", "iot_greengrass");
  add_icon("AWS Key Management Service", "kms");
  add_icon("Amazon Kinesis Analytics", "kinesis_analytics");
  add_icon("Amazon Kinesis Analytics V2", "kinesis_analytics");
  add_icon("Amazon Kinesis Firehose", "kinesis_firehose");
  add_icon("Amazon Kinesis Video Streams", "kinesis_streams");
  add_icon("AWS Lambda", "lambda");
  add_icon("Amazon Lex", "lex");
  add_icon("Amazon Lightsail", "lightsail");
  add_icon("Amazon Machine Learning", "machine_learning");
  add_icon("Amazon Macie", "macie");

  add_icon("Amazon Mechanical Turk", "mturk");
  add_icon("AWS Migration Hub", "migration_hub");
  add_icon("Amazon Mobile Analytics", "mobile_analytics");
  add_icon("AWS Mobile Hub", "mobile_hub");
  add_icon("AWS Organizations", "organizations");
  add_icon("Amazon Pinpoint", "pinpoint");
  add_icon("Amazon Pinpoint SMS and Voice Service", "pinpoint");
  add_icon("Amazon Polly", "polly");
  add_icon("Amazon QuickSight", "quicksight");
  add_icon("Amazon Rekognition", "rekognition");
  add_icon("Amazon Route53 Domains", "route53domains");

  add_icon("AWS Security Token Service", "sts");
  add_icon("AWS Service Catalog", "service_catalog");
  add_icon("AWS Shield", "shield");
  add_icon("AWS Systems Manager", "ssm");
  add_icon("AWS Snowball", "snowball");
  add_icon("AWS Step Functions", "step_functions");
  add_icon("AWS Trusted Advisor", "trusted_advisor");
  add_icon("AWS WAF", "waf");
  add_icon("AWS WAF Regional", "waf");
  add_icon("Amazon WorkDocs", "workdocs");
  add_icon("Amazon WorkMail", "workmail");
  add_icon("Amazon WorkSpaces", "workspaces");
  add_icon("Amazon WorkSpaces Application Manager", "workspaces");
  add_icon("AWS X-Ray", "xray");

  // The following icons already exists, but are not used for subservices
  add_icon("CloudWatch Application Insights", "cloudwatch");
  add_icon("Amazon CloudWatch Logs", "cloudwatch");
  add_icon("Amazon CloudWatch Synthetics", "cloudwatch");
  add_icon("Amazon DynamoDB Accelerator (DAX)", "dynamodb");
  add_icon("AWS OpsWorks Configuration Management", "opsworks");
}, 200);
