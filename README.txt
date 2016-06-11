1. The hardest challenge at the exercise was to understand the dynamics of the server and client. It took us a few days to understand it completely.
2. It was cool to see our ex2 works on the server.
3. In order to keep our server efficient, we used asynchrony methods, where we believed it won't  affect the running time.
4. We tested the server by loading it with large number of clients. Moreover, we checked four cases:  unreachable file test, non-exist file test, unsupported file format and supplying existed legal file.
Here below you may find the results:

Asking the server to upon an unreachable file.
Expected:  Failed
Actual: Failed

Asking the server for non exist file.
Expected: Failed
Actual: Failed

Asking the server for unsupported file format.
Expected:  Failed
Actual: Failed

Asking the server to supply the ex2 files.
Expected: Success
Actual: Success