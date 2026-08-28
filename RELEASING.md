# Releasing

Maintainer guide for publishing `formable-node` to npm. Consumers should follow the [README](README.md).

Use semver. The published version is `package.json` `version`.

## Publish a version

1. Bump `version` in `package.json`.
2. Commit the change on `main`.
3. Tag and push:

   ```bash
   git tag v0.1.12
   git push origin main v0.1.12
   ```

4. Publish:

   ```bash
   npm publish
   ```

`prepublishOnly` runs typecheck and build before the package is uploaded. The package is at [npmjs.com/package/formable-node](https://www.npmjs.com/package/formable-node).
