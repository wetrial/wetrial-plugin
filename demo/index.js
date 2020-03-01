const fetch = require('node-fetch');

fetch('http://npm.xxgtalk.cn/-/verdaccio/search/**', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWFsX2dyb3VwcyI6WyJ4aWV4aW5nZW4iXSwibmFtZSI6InhpZXhpbmdlbiIsImdyb3VwcyI6WyJ4aWV4aW5nZW4iLCIkYWxsIiwiJGF1dGhlbnRpY2F0ZWQiLCJAYWxsIiwiQGF1dGhlbnRpY2F0ZWQiLCJhbGwiLCJ4aWV4aW5nZW4iXSwiaWF0IjoxNTgzMDUyOTc5LCJuYmYiOjE1ODMwNTI5NzksImV4cCI6MTU4MzY1Nzc3OX0.zPnpQjxNQyGi07579w1cVe4GwnHCwHDZ3uGJyYdOa4o',
  },
})
  .then(res => res.json())
  .then(response => {
    const names = response.map(item => item.name);

    debugger;
  });
