const search = {
  params: {
    keyword: {
      type: 'string'
    },
    range: {
      type: 'string',
      enum: ['title', 'tag', 'all']
    }
  },
  required: ['range', 'keyword'],
  additionalProperties: false,
};

export { search };