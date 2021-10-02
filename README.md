# DynamoDB Research

Capturing set up, processes, and thoughts around DynamoDB

## What is DynamoDB?

DynamoDB is a key-value and document database as a service offered by AWS.

## Who is my target audience?

Experienced developer.  Should be comfortable:

- working with command line tools
- able to navigate the AWS dashboard
- has some node.js experience
- looking for a quick start into DynamoDB
- familiarity with Docker

## Why do I care about DynamoDB?

DynamoDB is a well established serverless datastore that is often used in the AWS environment.

## Local installation

A simple way in with a [docker image](https://hub.docker.com/r/amazon/dynamodb-local)

```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

[AWS docker compose local installation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)

## Tables, Items, Attributes

### Tables

Simple Partition Key, or complex when a Sort Key is added.

- Primary Keys
- Secondary Indexes
- Read and Write capacities

### Items

Items are the entries in a table.
The data structure of an item can incorporate scalars, lists, sets, maps and a combination of all of the types.
A funky JSON syntax is used to specify the item.  It incorporates type.

```json
need to put a complex example here
```

## Command Line

To work at the command line, you will of course need to have the [AWS CLI](https://aws.amazon.com/cli/) installed.

[AWS CLI quick start](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.CLI.html)

### Local Installation

Because of the way the aws cli client works, you **must** have your aws cli credentials configured. :-/  [Local usage notes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.UsageNotes.html)

__If you don't properly set the endpoint you will create resources in the AWS cloud environment.__

The `--endpoint-url ...` must be included for accessing the local DynamoDB instance with the aws cli.

Save yourself some typing, and export this bit of the command to an environment variable:

```bash
export LOCAL="--endpoint-url http://localhost:8000"
```

Or, use the included shell script:

```bash
. ./setLocal.sh
```

Do an `echo $LOCAL` to confirm that this variable has been set.  You will need to _do this in every shell environment_.

### bash vs zsh

With bash you will append `$LOCAL` to the command.
With zsh you will append `${=LOCAL}` to the command.
See the [CLI: List tables](#CLI:-List-tables) command for an example.

### CLI: Create a table

Create a table specifying the _key_ structure.

```zsh
aws dynamodb create-table \
    --table-name Users \
    --attribute-definitions \
        AttributeName=UserId,AttributeType=S \
        AttributeName=AppId,AttributeType=S \
    --key-schema \
        AttributeName=UserId,KeyType=HASH \
        AttributeName=AppId,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1 ${=LOCAL}
```

### CLI: List tables

```bash
aws dynamodb list-tables $LOCAL
```

and with zsh:

```zsh
aws dynamodb list-tables ${=LOCAL}
aws dynamodb describe-table --table-name Users ${=LOCAL}
```

### CLI: Insert an item

Inserting just the necessary keys:

```zsh
aws dynamodb put-item \
--table-name Users \
--item \
'{ "UserId": {"S": "test_user_email" }, "AppId": {"S": "big_app"}  }' \
${=LOCAL}
```

Inserting keys _with_ data:

```zsh
aws dynamodb put-item \
--table-name Users \
--item \
'{ "UserId": {"S": "test_user_email" }, "AppId": {"S": "big_app2"}, "Token" : {"S": "lookupToken" }, "Secret": {"S":"secret2"}  }' \
${=LOCAL}

aws dynamodb put-item \
--table-name Users \
--item \
'{ "UserId": {"S": "user2_email"}, "AppId": {"S": "big_app2"}, "Token" : {"S": "lookupToken" }, "Secret": {"S":"secret"}  }' \
${=LOCAL}
```

### CLI: Query items

By key:

```zsh
aws dynamodb get-item --consistent-read \
--table-name Users \
--key '{ "UserId": {"S": "test_user_email" }, "AppId": {"S": "big_app"}  }'  \
${=LOCAL}

aws dynamodb get-item --consistent-read \
--table-name Users \
--key '{ "UserId": {"S": "user2_email" }, "AppId": {"S": "big_app2"}  }'  \
${=LOCAL}
```

This is a query on key fields.  It is able to use the keys and only look at the necessary items.
Note the implementation of `begins_with` as a function in this query key condition expression:

```zsh
aws dynamodb query --select ALL_ATTRIBUTES \
--table-name Users \
--key-condition-expression 'UserId = :uid AND begins_with(AppId, :appId)' \
--expression-attribute-values '{ ":uid" : {"S":"test_user_email"}, ":appId" : {"S":"b"} }'  \
${=LOCAL}
```

### CLI: Scan for items

This scan operation will look at _every_ document in the table.

```zsh
aws dynamodb scan --select ALL_ATTRIBUTES \
--table-name Users \
--filter-expression 'UserId = :uid AND begins_with(AppId, :appId)' \
--expression-attribute-values '{ ":uid" : {"S":"test_user_email"}, ":appId" : {"S":"b"} }'  \
${=LOCAL}

aws dynamodb scan --select ALL_ATTRIBUTES \
--table-name Users \
--filter-expression 'UserId = :uid' \
--expression-attribute-values '{ ":uid" : {"S":"test_user_email"} }'  \
${=LOCAL}
```

### CLI: Update items

[CLI update command reference](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/update-item.html)

`Token` is a reserved keyword, so have to do the `--expression-attribute-names` work around.

```zsh
aws dynamodb update-item \
--table-name Users \
--key '{ "UserId": {"S": "test_user_email" }, "AppId": {"S": "big_app"}  }' \
--update-expression "SET Vip = :isVip" \
--expression-attribute-values '{ ":isVip" : {"BOOL":false} }'  \
--return-values ALL_NEW \
${=LOCAL}

aws dynamodb update-item \
--table-name Users \
--key '{ "UserId": {"S": "test_user_email" }, "AppId": {"S": "big_app"}  }' \
--update-expression "SET #T = :n" \
--expression-attribute-names '{"#T":"Token"}' \
--expression-attribute-values '{":n" : {"S":"someToken"} }'  \
--return-values ALL_NEW \
${=LOCAL}

aws dynamodb update-item \
--table-name Users \
--key '{ "UserId": {"S": "test_user_email" }, "AppId": {"S": "big_app"}  }' \
--update-expression "SET #Token = :newToken, Secret = :newSecret" \
--expression-attribute-names '{"#Token":"Token"}' \
--expression-attribute-values '{ ":newToken" : {"S":"someToken"}, ":newSecret" : {"S":"super-secret"} }'  \
--return-values ALL_NEW \
${=LOCAL}
```

### CLI: Delete items

```zsh
aws dynamodb delete-item \
--table-name Users \
--key '{ "UserId": {"S": "test_user_email" }, "AppId": {"S": "big_app"}  }' \
--return-values ALL_OLD \
${=LOCAL}
```

### CLI: Drop a table

```zsh
aws dynamodb delete-table --table-name Users ${=LOCAL}
```

## node.js token service

A token service that works with DynamoDB is documented in the [`TokenService`](TokenService/README.md) directory.

## Resource documentation

- [AWS DynamoDB](https://aws.amazon.com/dynamodb) - [Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) - [API Guide](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html)
- [AWS CLI command reference](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html#cli-aws-dynamodb)
- [DynamoDB Guide](https://www.dynamodbguide.com/what-is-dynamo-db)
