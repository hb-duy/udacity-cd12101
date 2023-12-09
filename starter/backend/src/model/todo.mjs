export const newTodoSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        name: { type: 'string', minLength: 1 },
        dueDate: { type: 'string', minLength: 1 }
      },
      required: ['name', 'dueDate']
    }
  },
  required: ['body']
}

export const updateTodoSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        done: { type: 'boolean' }
      },
      required: ['done']
    }
  },
  required: ['body']
}

