import 'reflect-metadata';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import { PostService } from '../../src/application/services/PostService';
import { IPostRepository } from '../../src/domain/repositories/IPostRepository';
import { PostDtoIn, PostDtoOut, UpdatePostData } from '../../src/interfaces/Interfaces';
// @ts-ignore
import createError from 'http-errors';

// Mock del repositorio
const mockPostRepository: jest.Mocked<IPostRepository> = {
    create: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addLike: jest.fn(),
    addDislike: jest.fn(),
};

describe('PostService Unit Tests', () => {
    let postService: PostService;

    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
        postService = new PostService(mockPostRepository); // Inyecta el mock
    });

    describe('createPost', () => {
        it('should create a post successfully', async () => {
            const mockPost: PostDtoIn = {
                title: 'Test Post',
                post: 'This is a test post.',
                author: 'testUser',
                image: null,
                like: 0,
                disLike: 0
            };

            mockPostRepository.create.mockResolvedValue('Post created successfully');

            const result = await postService.createPost(mockPost);

            expect(result).toBe('Post created successfully');
            expect(mockPostRepository.create).toHaveBeenCalledWith(mockPost);
            expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if post creation fails', async () => {
            const mockPost: PostDtoIn = {
                title: 'Test Post',
                post: 'This is a test post.',
                author: 'testUser',
                image: null,
                like: 0,
                disLike: 0
            };

            mockPostRepository.create.mockRejectedValue(createError(500, 'Failed to create post'));

            await expect(postService.createPost(mockPost)).rejects.toThrow('Failed to create post');
            expect(mockPostRepository.create).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('getPost', () => {
        it('should return a post successfully', async () => {
            const mockPost: PostDtoOut = {
                id: 1,
                title: 'Test Post',
                content: 'This is a test post.',
                // @ts-ignore
                author: 'testUser',
                createdAt: new Date(),
            };

            const mockResponse = {
                post: mockPost,
                likedUsers: ['user1', 'user2'],
                dislikedUsers: ['user3'],
            };

            mockPostRepository.get.mockResolvedValue(mockResponse);

            const result = await postService.getPost(1);

            expect(result.post.title).toBe('Test Post');
            expect(result.likedUsers).toEqual(['user1', 'user2']);
            expect(result.dislikedUsers).toEqual(['user3']);
            expect(mockPostRepository.get).toHaveBeenCalledWith(1);
            expect(mockPostRepository.get).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the post is not found', async () => {
            mockPostRepository.get.mockRejectedValue(createError(404, 'Post not found'));

            await expect(postService.getPost(999)).rejects.toThrow('Post not found');
            expect(mockPostRepository.get).toHaveBeenCalledWith(999);
        });
    });

    describe('getAllPosts', () => {
        it('should return all posts successfully', async () => {
            const mockPosts: PostDtoOut[] = [
                {
                    id: 1,
                    title: 'Test Post 1',
                    content: 'This is the first test post.',
                    // @ts-ignore
                    author: 'testUser',
                    createdAt: new Date(),
                },
                {
                    id: 2,
                    title: 'Test Post 2',
                    content: 'This is the second test post.',
                    // @ts-ignore
                    author: 'testUser',
                    createdAt: new Date(),
                },
            ];

            const mockResponse = {
                allPosts: mockPosts,
                likedPosts: [1],
                dislikedPosts: [2],
            };

            mockPostRepository.getAll.mockResolvedValue(mockResponse);

            const result = await postService.getAllPosts('testUser');

            expect(result.allPosts).toHaveLength(2);
            expect(result.likedPosts).toEqual([1]);
            expect(result.dislikedPosts).toEqual([2]);
            expect(mockPostRepository.getAll).toHaveBeenCalledWith('testUser');
            expect(mockPostRepository.getAll).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if no posts are found', async () => {
            mockPostRepository.getAll.mockRejectedValue(createError(404, 'No posts found'));

            await expect(postService.getAllPosts('unknownUser')).rejects.toThrow('No posts found');
            expect(mockPostRepository.getAll).toHaveBeenCalledWith('unknownUser');
        });
    });

    describe('updatePost', () => {
        it('should update a post successfully', async () => {
            const updateData: UpdatePostData = {
                title: 'Updated Title',
                post: 'Updated content.',
            };

            mockPostRepository.update.mockResolvedValue('Post updated successfully');

            const result = await postService.updatePost(1, updateData);

            expect(result).toBe('Post updated successfully');
            expect(mockPostRepository.update).toHaveBeenCalledWith(1, updateData);
            expect(mockPostRepository.update).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the post update fails', async () => {
            const updateData: UpdatePostData = {
                title: 'Updated Title',
                post: 'Updated content.',
            };

            mockPostRepository.update.mockRejectedValue(createError(404, 'Post not found'));

            await expect(postService.updatePost(999, updateData)).rejects.toThrow('Post not found');
            expect(mockPostRepository.update).toHaveBeenCalledWith(999, updateData);
        });
    });

    describe('deletePost', () => {
        it('should delete a post successfully', async () => {
            mockPostRepository.delete.mockResolvedValue('Post deleted successfully');

            const result = await postService.deletePost(1);

            expect(result).toBe('Post deleted successfully');
            expect(mockPostRepository.delete).toHaveBeenCalledWith(1);
            expect(mockPostRepository.delete).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the post deletion fails', async () => {
            mockPostRepository.delete.mockRejectedValue(createError(404, 'Post not found'));

            await expect(postService.deletePost(999)).rejects.toThrow('Post not found');
            expect(mockPostRepository.delete).toHaveBeenCalledWith(999);
        });
    });
});
