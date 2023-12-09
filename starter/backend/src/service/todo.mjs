import { db } from './db.mjs'
import { storage } from './storage.mjs'

class TodoService {
  constructor() {

  }

  async getTodos(userId) {
    return await db.getTodos(userId)
  }

  async createTodo(userId, todo) {
    return await db.newTodo(userId, todo)
  }

  async updateTodo(userId, todoId, done) {
    return await db.updateTodoDone(userId, todoId, done)
  }

  async getUploadUrl(userId, todoId) {
    const uploadUrl = await storage.getUploadUrl(todoId)
    const attachmentUrl = storage.getAttachmentUrl(todoId)
    await db.updateTodoAttachment(userId, todoId, attachmentUrl)
    return uploadUrl
  }
  
  async deleteTodo(userId, todoId) {
    await db.deleteTodo(userId, todoId)
    await storage.deleteObject(todoId)
  }
}

export const todoService = new TodoService();