The id of the extension has been generated deterministicly following those steps:

```
# Create private key called key.pem
2>/dev/null openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem

# Generate string to be used as "key" in manifest.json (outputs to stdout)
2>/dev/null openssl rsa -in key.pem -pubout -outform DER | openssl base64 -A

# Calculate extension ID (outputs to stdout)
2>/dev/null openssl rsa -in key.pem -pubout -outform DER |  shasum -a 256 | head -c32 | tr 0-9a-f a-p
```

Credits to [this](https://stackoverflow.com/questions/23873623/obtaining-chrome-extension-id-for-development/23877974#23877974) solution.

Basically in the `public/manifest.json` file we specify the key attribute with the output of the second command.

Finally when we use puppeter for running e2e tests we specify the id when navigating to the extension

```
await page.goto(
  'chrome-extension://dafekhlcpidfaopcimocbcpciholgkkb/index.html',
  { waitUntil: 'networkidle2' }
);
```
