const search = {
  params: {
    keyword: {
      type: 'string'
    },
    range: {
      type: 'string',
      enum: ['title', 'tag', 'all', 'author']
    }
  },
  required: ['range', 'keyword'],
  additionalProperties: false,
};

export { search };