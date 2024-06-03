terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  backend "remote" {
    organization = "alex27_Org"

    workspaces {
      name = "travel-expensetracker-tester"
    }
  }
}

provider "aws" {
  region = "us-west-1"
}

resource "aws_s3_bucket" "bucket2_react" {
  bucket = "my-s3-bucket-travelexpense-tester"

  tags = {
    Name        = "MyS3Bucket2"
  }
}


resource "aws_s3_object" "files" {
  bucket   = aws_s3_bucket.bucket2_react.id
  for_each = fileset("/Users/alexslone/Projects/travel-expense-tester/build/static", "**")
  key      = each.value
  source   = "/Users/alexslone/Projects/travel-expense-tester/build/static/${each.value}"
}
#Lambda function 
#Initializing Lambda Role First 
resource "aws_iam_role" "lambda_role" {
  name = "Test_Lambda_Function_Role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_policy_for_lambda" {
  name        = "aws_iam_policy_for_terraform_aws_lambda_role"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.iam_policy_for_lambda.arn
}
resource "aws_lambda_function" "expense_tracker" {
  function_name = "expense_tracker"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  filename      = "${path.module}/../lambda.zip"

  source_code_hash = filebase64sha256("${path.module}/../lambda.zip")
}

resource "aws_apigatewayv2_api" "expense_api" {
  name          = "expense_api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.expense_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.expense_tracker.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "lambda_route" {
  api_id    = aws_apigatewayv2_api.expense_api.id
  route_key = "POST /expenses"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.expense_tracker.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.expense_api.execution_arn}/*/*"
}