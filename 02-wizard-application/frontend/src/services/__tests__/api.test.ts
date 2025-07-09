import { apiService } from '../api'

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

// Create a mock axios instance
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
}

// Mock the axios.create to return our mock instance
const axios = require('axios')
axios.create.mockReturnValue(mockAxiosInstance)

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('get method', () => {
    it('should make GET request with correct URL', async () => {
      const mockResponse = { data: { message: 'success' } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await apiService.get('/test-endpoint')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { params: undefined })
      expect(result).toEqual({ message: 'success' })
    })

    it('should make GET request with query parameters', async () => {
      const mockResponse = { data: { results: [] } }
      const params = { page: 1, limit: 10 }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await apiService.get('/test-endpoint', params)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { params })
      expect(result).toEqual({ results: [] })
    })

    it('should handle GET request errors', async () => {
      const error = new Error('Network error')
      mockAxiosInstance.get.mockRejectedValue(error)

      await expect(apiService.get('/test-endpoint')).rejects.toThrow('Network error')
    })

    it('should return response data only', async () => {
      const mockResponse = { 
        data: { message: 'success', id: 123 },
        status: 200,
        headers: {}
      }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await apiService.get('/test-endpoint')

      expect(result).toEqual({ message: 'success', id: 123 })
      expect(result).not.toHaveProperty('status')
      expect(result).not.toHaveProperty('headers')
    })
  })

  describe('post method', () => {
    it('should make POST request with correct URL and data', async () => {
      const mockResponse = { data: { id: 123, created: true } }
      const postData = { name: 'Test', email: 'test@example.com' }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await apiService.post('/test-endpoint', postData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData)
      expect(result).toEqual({ id: 123, created: true })
    })

    it('should make POST request without data', async () => {
      const mockResponse = { data: { message: 'success' } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await apiService.post('/test-endpoint')

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', undefined)
      expect(result).toEqual({ message: 'success' })
    })

    it('should handle POST request errors', async () => {
      const error = new Error('Validation error')
      mockAxiosInstance.post.mockRejectedValue(error)

      await expect(apiService.post('/test-endpoint', {})).rejects.toThrow('Validation error')
    })

    it('should return response data only', async () => {
      const mockResponse = { 
        data: { message: 'created', id: 456 },
        status: 201,
        headers: {}
      }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await apiService.post('/test-endpoint', {})

      expect(result).toEqual({ message: 'created', id: 456 })
      expect(result).not.toHaveProperty('status')
      expect(result).not.toHaveProperty('headers')
    })

    it('should handle complex POST data', async () => {
      const mockResponse = { data: { success: true } }
      const complexData = {
        user: { name: 'John', age: 30 },
        preferences: ['setting1', 'setting2'],
        metadata: { timestamp: Date.now() }
      }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await apiService.post('/test-endpoint', complexData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', complexData)
      expect(result).toEqual({ success: true })
    })
  })

  describe('axios instance configuration', () => {
    it('should create axios instance with correct configuration', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
  })

  describe('error handling', () => {
    it('should propagate axios errors', async () => {
      const axiosError = {
        response: {
          status: 400,
          data: { error: 'Bad Request' }
        },
        message: 'Request failed with status code 400'
      }
      mockAxiosInstance.get.mockRejectedValue(axiosError)

      await expect(apiService.get('/test-endpoint')).rejects.toEqual(axiosError)
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error')
      mockAxiosInstance.post.mockRejectedValue(networkError)

      await expect(apiService.post('/test-endpoint')).rejects.toThrow('Network Error')
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded')
      mockAxiosInstance.get.mockRejectedValue(timeoutError)

      await expect(apiService.get('/test-endpoint')).rejects.toThrow('timeout of 10000ms exceeded')
    })
  })

  describe('parameter types', () => {
    it('should accept string parameters', async () => {
      const mockResponse = { data: { results: [] } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      await apiService.get('/test-endpoint', { query: 'search term' })

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { 
        params: { query: 'search term' } 
      })
    })

    it('should accept number parameters', async () => {
      const mockResponse = { data: { results: [] } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      await apiService.get('/test-endpoint', { page: 1, limit: 10 })

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { 
        params: { page: 1, limit: 10 } 
      })
    })

    it('should accept boolean parameters', async () => {
      const mockResponse = { data: { results: [] } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      await apiService.get('/test-endpoint', { active: true, deleted: false })

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { 
        params: { active: true, deleted: false } 
      })
    })

    it('should accept object data in POST', async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const postData = { 
        user: { name: 'John' }, 
        settings: { theme: 'dark' } 
      }

      await apiService.post('/test-endpoint', postData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData)
    })

    it('should accept array data in POST', async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const postData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]

      await apiService.post('/test-endpoint', postData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData)
    })
  })
})