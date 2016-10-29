# Cloud Analytics City Tour (Snowflake)

## Intro

- Tony Cosentino

"People, Process, and Technology"

Technology outpaced the the others.

Governance is a huge prolem - an opportunity.


## Data Warehouse built for the cloud

- Bob Muglia, CEO

> 73% of companies have invested or are planning to, in big data.
> 15% report that they've actually deployed big data into production.
> -- Gartner

### Challenge

- Silos and Islands of data (distributed across systems with little-no relationship)
- Complexity (multiple systems, complex pipelines, skills & resources)
- Cost (upfront capital, replication, high storage demands)
- Delays

The secret to fast: do less. Don't scan petabytes of data while you load it; just make it accessible. Scan later.


### Snoflake goals

- Performance (iteratively faster is MUCH BETTER than slow)
- Concurrency (multiple user groups w/ simultaneous access and no performance degradation)
- Simplicity (fully managed, pay-as-you-go)


Data Warehouse Built for the Cloud

- A SQL database; DDL, query, RBAC, transactions (multi-statements), updates & deletes.

Zero management: fully managed by vendor, no tuning required; zero infrastructure cost, zero admin cost.


**All** of your data: structured and semi-structured, incl. JSON, XML, and Avro formats.

**_NOTE_** addresses the change of data model over time, from (e.g.) application sources, deferred schema modeling.

Data is stored columnar; priced like AWS S3.


#### Legacy architectures

1. Shared disk, shared storage, single cluster - all nodes share storage.
2. Shared-nothing, decentralied local storage; single cluster, sharded.

#### Snowflakes' architecture

- Multi-cluster, shared (centralized) data storage. 

Enables multiple clusters to be deployed against a central storage environment: scales horizontally *very well*.


### Implications

Snowflake is *fast enough* that people are building applications against it, incl. PDX.



## Tableau

- Ross Perez

Common problems:

- Static reports, inflexible dashboards
- Static data extracted from an ODS
- "Duct taped" ETL - poor handling of third-party data sources
- Limited investment in new data

Tableau's goal: answer questions, support iteractive questioning.

- Iterative design, infinite flexibility
- Fast, direct connections to real databases
- Add data as you need it, "instantly" (let Tableau handle ELT during report)
- Enables you (frees you up) to find more data


## Iovation

- Kurk Spendlove

The Power of Device Intelligence

HQ in Portland OR

Market: authentication and fraud prevention.

### Things they tried (and failed)

- Parallel Grep & JQ
- Oracle      (too expensive)
- Cassandra   (just not a good fit for analytics)
- PostgreSQL  (failed on scale)
- Vertica     (too expensive)


### Benefits of Snowflake

- JSON "As is"
- Secure (HIPPA and PCI compliant)
- Simple setup
- Ingestion
- Scales
- Results


Provides a sensible query language for extracting JSON on the fly.
60TB of data, mostly JSON, collected in ~ 1yr; no need to extract, just query it on the fly.

Faster iteration through short response time; creating new products is accellerated by rapid data access.

Don't have to deal with schema changes on ingestion. !!!


## Q&A

Data accessibility effects culture around BI; when the only way to complete a job is to separate data from the central source, it degrades the culture of data sharing. When access can be shared instantly, there's a culture of common insight.


Participant comments...

- Many times a consultation starts with ingest, just to get things into a "data lake", when an organization is very immature in their BI. Exploration is enabled by Snowflake; querying data out of raw JSON is sufficient for Iovation, no further transformation was required.