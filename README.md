## Node.js Event-Loop and Worker Threads 

## Load Testing

Running the server and load test locally won't provide accurate results.
Creating two VMs on a hosting provider, e.g two Fedora 36 VMs on DigitalOcean
is a good idea.

I tested using a 4CPU/16GB server, and an 8CPU/16GB client. You may want to
alter the `constantUsersPerSec` values in the *NodeSimulation.java* file
depending on the server resources available.

### Server Setup

Clone and build the Node.js application:

```bash
# Increase max allowed number of open file descriptors
ulimit -n 65536

# Clone this repository and build the application
git clone $THIS_REPO_URL nodejs-worker-threads
cd nodejs-worker-threads/
npm install
npm run build
```

Choose an `npm run start` command to start the application with or without
enhanced scalability features:

```bash
# Start an instance of the application
npm run start

# Start an instance of the application with worker threads enabled
npm run start:threaded

# Start an instance of the application per CPU core
npm run start:clustered
```

### Client Setup 

```bash
# Increase max allowed number of open file descriptors
ulimit -n 65536

# Clone the repository and access the load test directory
git clone $THIS_REPO_URL nodejs-worker-threads
cd nodejs-worker-threads/gatling-3.8.4

# Empty the results directory and remove old results
rm -rf results/*
rm ~/results.zip

# Set the target URL for load tests
export GATLING_TARGET_BASE_URL=http://10.1.2.3:8080

# Run the Gatling-based tests
./bin/gatling.sh
```
