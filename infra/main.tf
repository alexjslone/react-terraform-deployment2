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


/*
# Upload files to S3 Bucket
resource "aws_s3_object" "provision_source_files" {
  bucket = aws_s3_bucket.bucket2_react.bucket

  # Use fileset to get a set of files matching the pattern
  for_each = fileset("/Users/alexslone/Projects/travel-expense-tester/build", "watAruncopy.jpg")
  key      = each.value
  source   = "/Users/alexslone/Projects/travel-expense-tester/build/${each.value}"
}




# Debugging outputs
output "single_file_output" {
  value = file("/Users/alexslone/Projects/travel-expense-tester/build/watAruncopy.jpg")
}

output "fileset_output" {
  value = fileset("/Users/alexslone/Projects/travel-expense-tester/build", "*.jpg")
}




resource "aws_s3_object" "static_files" {
  for_each = fileset("/Users/alexslone/Projects/travel-expense-tester/build", "*.jpg")
  bucket   = aws_s3_bucket.bucket2_react.bucket
  key      = each.value
  source   = "/Users/alexslone/Projects/travel-expense-tester/build/${each.value}"
}



# Adding a file to my S3 bucket, confirmed that this works as my files are now in AWS console
resource "aws_s3_object" "static_files" {
  for_each = fileset("/Users/alexslone/Projects/travel-expense-tester/build/watAruncopy.jpg", "**")
  bucket = aws_s3_bucket.bucket2_react.bucket
  # Upload all files in the build folder to the S3 bucket
  key    = each.value
  source = "/Users/alexslone/Projects/travel-expense-tester/build/watAruncopy.jpg/${each.value}"
}
 */