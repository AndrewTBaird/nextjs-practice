import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe.skip('API Service', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any)
  })

  describe('get method', () => {
    it('should make GET request with correct URL', async () => {
      const { apiService } = require('../api')
      const mockResponse = { data: { message: 'success' } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await apiService.get('/test-endpoint')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { params: undefined })
      expect(result).toEqual({ message: 'success' })
    })

    it('should make GET request with query parameters', async () => {
      const { apiService } = require('../api')
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
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
  })
})