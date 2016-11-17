---
title: The Agile Data Warehouse on Amazon Redshift
date: 2016-09-12 12:23:21
author: Sam Briesemeister
category: devops/business-intelligence
tags: devops business-intelligence redshift
layout: post
description: Techniques for flexible growth of a data warehouse in Amazon Redshift

redirect_from:
- /redshift-data-warehouse

excerpt: >
    Redshift is a great OLAP database environment, though its limitations may surprise you. Many of its benefits are derived from its simplicity, belied by these limitations. Provided these techniques and design considerations can be applied, Redshift offers the flexibility needed for growing, evolving organizations to leverage their data at massive scale. Overcoming these limitations requires a tooling ecosystem *surrounding* Redshift, whereas Redshift must be respected for the simple, efficient, and yet robustly queriable datastore that it is.

---

* TOC
{:toc}

## Evolution through Continuous Deployment

As with any good improvement model, some goals, guidelines, and a basic framework for success must be established. In the case of business intelligence projects like this, the purpose is ultimately to support accellerating organizational change with better insights. Delivering valueable analysis quickly becomes the goal, in an environment with an ever growing set of data sources to integrate.

The guidelines for this work align to the goals of DevOps:

- Automate everything, driven by version-managed configuration, especially routine maintenance
- Minimize complexity of work to make small evolutionary changes to configuration, schemata and data models
- Reduce lead-time for data model changes and new data source integration
- Provide sensible utilities to accelerate (preferably automate) data discovery
- Provide robust logging of all deployments, data modeling workloads (e.g. ETL),
- Provide snapshots of both source and modeled data as *build artifacts*
- Provide assurances à la integration testing for all schema definition (DDL) and data modeling processes





## What Redshift Isn't

Truly the hardest lesson, in adopting Amazon Redshift, is to accept its strengths and limitations.

Redshift is a columnar datastore, with *relational query capabilities*, but it is **not** a relational database in the traditional sense. There are no foreign key constraints; foreign keys, when specified, are used only for _query planning_ and optimization.

While Redshift behaves more-or-less compatibly with PostgreSQL in many ways, it lacks many of the modern capabilities that PostgreSQL provides. Notable among these differences is Redshift's lack of support for **materialized** views ([detailed below](#getting-material)), very primitive support for JSON, and basically terrible performance on anything that isn't purely tabular.

In many respects, it's appropriate to view Redshift as a SQL query layer built over distributed storage, much like other map-reduce analytics solutions. There **are** distribution and sort keys, which make perfect sense for partitioning and sequencing à la map-reduce. It performs profoundly well on large datasets, where aggregation can be aligned to the distribution key structure (i.e. siloed within a segment of the data, to minimize network cost).


## The DIY Data Warehouse

Much of the _missing_ functionality which my clients find essential focuses around automation of ETL, data modeling, and reporting workflows. Where Redshift lacks features, the rest of the Amazon platform provides many resources to implement that functionality according to your business case.

This is where the DevOps paradigms become essential: infrastructure as code, microservices, continuous integration and continuous deployment are the foundation of successful automation, in this category. In general the implementations follow this model:

- **Everything** is managed in Git including schema definition, all configuration, and process logic (as code)
- A CI environment, such as [GitLab CI][1] is extended to fully automate deployment of all resources, including infrastructure, data schema, and static assets
- Regularly scheduled workloads integrate with CI to configure applications based on currently deployed schema state, etc.
- When a configuration, service or data schema changes in Git, within minutes it's tested against sample data, and deployed to production.


A few important considerations:

- Testing must always rely on data sampled from production data sources. This can be automated (relatively) simply with nightly `UNLOAD` and `LOAD` queries targeting S3.
- Some assurances, which we'd expect through unit- and integration-tesing in other software environs, can be supported by relying on the database engine to handle transactions. To safely test these, automation should spin up new Redshift instances for an isolated, disposable testing environment, using Amazon's APIs.
- The CI environment will therefore need access to the AWS API libraries and suitable credentials.


## Don't Flake Out

Because Redshift is _columnar_, it's also well-suited to a relatively high degree of _denormalized_ data, rather than fully snow-flaked structures, as the columnar storage lends itself to compression. Redshift is also best suited to batch-processing large datasets, as frequent loading of small changes tends to be inefficient.

With these in mind, I've found Redshift to perform better when modeling time-series data, with slowly-changing dimensionality, under something resembling a [Pure Type-6 fact table][2]. In general, process follows this model:

```sql
CREATE SCHEMA IF NOT EXISTS temp;
CREATE TABLE temp.ts_target$temp
	INTERLEAVED SORTKEY (timestamp, id)
	AS (
		SELECT
			SYSDATE as timestamp,
			id,
			other_fields_etc
		FROM
			source_table NATURAL JOIN other_source

	);

CREATE TABLE IF NOT EXISTS ts_target (LIKE temp.ts_target$temp);
ALTER TABLE ts_target APPEND FROM temp.ts_target$temp;
DROP TABLE IF EXISTS temp.ts_target$temp;
```

Historically this was implemented using Redshift's support for [`SELECT INTO`][3] queries, but Amazon's relatively recent addition of [`ALTER TABLE APPEND`][4] shows significant performance improvements.

The resulting *materialized* views include some level of denormalized records. In effect, Redshift's columnar storage relies on _decompression_ to provide the (effective) joining of dimension values to each record, rather than an explicit reference key structure.

Basically the same approach applies to materializing snapshots of views, without respect to any time-series model. The primary difference would be either truncating or replacing the target table.


## The Brittleness of JSON

Redshift has [some JSON support][5]. Yep.

In some cases, where organizations treat Redshift as a *data lake*, they may want to store raw stream data as JSON directly in Redshift, with the intent of making it easily queriable in the future. Two major limitations of Redshift pose significant challenges to this approach.

In my observation, it's almost always preferable to **avoid putting JSON in Redshift**. While it's possible to mitigate some of the below issues, doing so justifies some sort of up-front validation process on a JSON stream before it reaches Redshift.

Simply replacing that validation approach with a preliminary extraction process, before load, offers greater advantage.


### JSON Correctness

Redshift requires that all of the records containing JSON **must** be 100% valid UTF-8 encoded JSON. If any record deviates, it will block the _entire_ query from returning any results. When one record in millions has an error, it can prevent access to *all* of them.

In large-scale, evolving software environments, errors will occasionally occur, where one of the many systems sending JSON data somehow sends an incomplete or malformed record.

Two approaches seem sensible to mitigate for this problem _within_ Redshift, however neither offer a long-term holistic advantage:

1. Perform some kind of validation in Redshift, either in SQL (i.e. a validation view, even materialized), or as a [Python user-defined function][6].
2. Build other assurance into your data pipeline, such that invalid JSON _never_ reaches Redshift.

There are certainly other approaches. In either case above, the performance cost at scale has been simply untenable, even if you can assure 100% valid JSON.


### JSON Performance

For the description below, please consider a view such as this:

```sql
CREATE VIEW my_json_extractor AS (
	SELECT
		id,
		jsontext,
		json_extract_path_text(jsontext, 'triangle', 'base') as t_base
		json_extract_path_text(jsontext, 'triangle', 'height') as t_height,
		json_extract_path_text(jsontext, 'area') as area
	FROM
		my_base_table_with_json_field
);
```

In Redshift, JSON is stored as pure text, and never treated as an "object" until one of Redshift's functions attempts to read from it. Further, from what I observe, it seems when a query processes the JSON text, it does so separately for each function call.

In the example above, it would create 3 separate object instances for each record. For 100,000 records with 3 properties extracted from one JSON field, it would create 300,000 separate JSON objects.

This becomes inefficient quickly.

The problem is compounded by the evolving nature of software and the pace of modern development: naming conventions change, default values change, etc. This often justifies querying additional fields to infer the correct state, over data aggregated from years of operation from multiple, independently developed but otherwise related systems. The effect becomes a multiplicative performance overhead.

### Don't use JSON

In the end, our conclusion is to prefer avoiding JSON in Redshift altogether. A better approach, when dealing with JSON types, is to model them into tabular form before it ever reaches Redshift. I've seen great results from combining DynamoDB, streaming through a Lambda job, and then stored elsewhere for Redshift to pick up. S3 offers a good medium to retain longer-term snapshots, with fairly simple `LOAD` and `UNLOAD` options directly into Redshift.


## Avoiding Lock-in

Another painpoint of working with Redshift, especially when supporting integration from third-party data services, is *column locking* by views.

When you query a `view` in Redshift, it does **not** perform the text of the SQL query "on the fly" every time. Instead, when you create the view, it "binds" to the columns (by node, not by name) as a way to improve performance in the query planning process.

This has some benefits to the database operation, but its side-effects on human workflow (even when automated) become troublesome. In particular:

- After renaming a column that a view references, the view will behave as though updated to use the same name. (That's sort of OK.)
- A linked column cannot be removed from its table (or replaced) without first dropping the view that references it.

Because columns' types (including the **number** of characters allowed in a text field) are effectively locked-in and cannot be changed directly, the basic approach to structural adjustments requires:

1. Creating a new column,
2. Copying in the existing data,
3. Dropping the old column, and
4. Renaming the new column to replace the old.

The net effect is that even the smallest of structural changes requires completely dropping related views, applying the desired changes, and then re-creating the views.

This might be fine for some workflows, but when integrating data from multiple third-party vendors, across schemata they manage (and therefore occasionally change), it becomes a strong detraction from _using views at all_ in those cases.


### Getting Material

There's an alternate approach that resolves this limitation, though it may seem at first to be unintuitive. The automation cited above (in [The DIY Data Warehouse](#the-diy-data-warehouse)) facilitates a better approach.

When dealing with schemata that are likely to change, in this manner, views should be treated as ephemeral, not persisting against the underlying tables. The automation layer, performing scheduled jobs, should basically:

1. Create (temporarily) all of the views required to model your data.
2. Populate materialized tables from the integrated views.
3. Remove the temporary views.
4. Manipulate the materialized tables accordingly (`APPEND` for time-series, etc.)

A few more steps and considerations may be appropriate, as views are often a suitable abstraction layer to maintain for exposing data to business users. To provide that, the central point must be to isolate their dependencies on tables (materialized) whose schemata are managed by the BI development team(s).

## Realized Benefits

The general principals in [Evolution through Continuous Deployment](#evolution-through-continuous-deployment), and the techniques outlined to address these specific challenges have proven their worth many times.

1. When new data streams begin loading, we have workloads and models (i.e. views) built against them, tuned for initial roll-out to business users, within 30 minutes.
2. Maintenance is mostly automatic, operating scheduled jobs with logging and notifications directly in the Continuous Integration environment.
3. The high degree of automation accelerates work**flow**, allowing us to deliver real business value much faster. From the time when work (e.g. schema adjustment) is done, committed into the source-code repository, it usually reaches the production environment in less than 10 minutes.
4. The "plumbing" enables us to innovate, instead of consuming focus and costing us time.


## Conclusions

Redshift is a great OLAP database environment, though its limitations may surprise you. Many of its benefits are derived from its simplicity, belied by these limitations. Provided these techniques and design considerations can be applied, Redshift offers the flexibility needed for growing, evolving organizations to leverage their data at massive scale. Overcoming these limitations requires a tooling ecosystem *surrounding* Redshift, whereas Redshift must be respected for the simple, efficient, and yet robustly queriable datastore that it is.


[1]: https://about.gitlab.com/gitlab-ci/
[2]: https://en.wikipedia.org/wiki/Slowly_changing_dimension#Pure_type_6_implementation
[3]: http://docs.aws.amazon.com/redshift/latest/dg/r_SELECT_INTO.html
[4]: http://docs.aws.amazon.com/redshift/latest/dg/r_ALTER_TABLE_APPEND.html
[5]: http://docs.aws.amazon.com/redshift/latest/dg/json-functions.html
[6]: http://docs.aws.amazon.com/redshift/latest/dg/udf-python-language-support.html
