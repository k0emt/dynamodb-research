# DynamoDB Research

Capturing set up, processes, and thoughts around DynamoDB

## What is DynamoDB

## Why do I care about DynamoDB?

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

### Useful commands

The `--endpoint-url ...` must be included for accessing the local DynamoDB instance with the aws cli.

Also, because of the way the aws cli client works, you **must** have your aws cli credentials configured. :-/  [Local usage notes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.UsageNotes.html)

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

## node.js

## Resource documentation

- [AWS DynamoDB](https://aws.amazon.com/dynamodb) - [Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) - [API Guide](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html) 
- [DynamoDB Guide](https://www.dynamodbguide.com/what-is-dynamo-db)
