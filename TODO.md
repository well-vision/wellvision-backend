# TODO: Fix MongoDB Connection Issues

## Issues Identified:
1. **IP Whitelisting**: Current IP not whitelisted in MongoDB Atlas
2. **Deprecated Options**: useNewUrlParser and useUnifiedTopology are deprecated
3. **Duplicate Schema Index**: Warning about duplicate index on {"name":1}

## Steps to Fix:
- [x] Remove deprecated connection options from index.js
- [ ] Whitelist current IP in MongoDB Atlas (or allow 0.0.0.0/0 for development)
- [x] Investigate and fix duplicate schema index warning
- [ ] Test the connection after fixes
