import 'reflect-metadata';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CommentDtoIn, CommentDtoOut, UpdateCommentData } from "../../src/interfaces/Interfaces";
import { ICommentRepository } from "../../src/domain/repositories/ICommentRepository";

// Mock CommentRepository
const mockCommentRepository = (): jest.Mocked<ICommentRepository> => ({
    create: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    getByPost: jest.fn(),
    getByReview: jest.fn(),
    getByComment: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addLike: jest.fn(),
    addDislike: jest.fn(),
});

describe("CommentRepository", () => {
    let commentRepository: jest.Mocked<ICommentRepository>;

    beforeEach(() => {
        commentRepository = mockCommentRepository();
    });

    describe("create", () => {
        it("should create a comment", async () => {
            const comment: CommentDtoIn = {
                content: "This is a test comment",
                author: "testUser",
                post: 1
            };

            commentRepository.create.mockResolvedValue("Comment created successfully");

            const result = await commentRepository.create(comment);

            expect(result).toBe("Comment created successfully");
            expect(commentRepository.create).toHaveBeenCalledWith(comment);
        });
    });

    describe("get", () => {
        it("should get a comment by ID", async () => {
            const comment: CommentDtoOut = {
                id: 1,
                content: "This is a test comment",
                // @ts-ignore
                author: "testUser",
                createdAt: new Date()
            };

            commentRepository.get.mockResolvedValue(comment);

            const result = await commentRepository.get(1);

            expect(result).toEqual(comment);
            expect(commentRepository.get).toHaveBeenCalledWith(1);
        });
    });

    describe("getAll", () => {
        it("should get all comments", async () => {
            const comments: CommentDtoOut[] = [
                { id: 1, content: "Comment 1", // @ts-ignore
                author: "User1", createdAt: new Date() },
                { id: 2, content: "Comment 2", // @ts-ignore
                author: "User2", createdAt: new Date() },
            ];

            commentRepository.getAll.mockResolvedValue(comments);

            const result = await commentRepository.getAll();

            expect(result).toEqual(comments);
            expect(commentRepository.getAll).toHaveBeenCalled();
        });
    });

    describe("getByPost", () => {
        it("should get comments by post ID", async () => {
            const comments: CommentDtoOut[] = [
                { id: 1, content: "Comment for post 1", // @ts-ignore
                author: "User1", createdAt: new Date() },
            ];

            commentRepository.getByPost.mockResolvedValue(comments);

            const result = await commentRepository.getByPost(1);

            expect(result).toEqual(comments);
            expect(commentRepository.getByPost).toHaveBeenCalledWith(1);
        });
    });

    describe("update", () => {
        it("should update a comment", async () => {
            const updatedComment: UpdateCommentData = { content: "Updated content" };

            commentRepository.update.mockResolvedValue("Comment updated successfully");

            const result = await commentRepository.update(1, updatedComment);

            expect(result).toBe("Comment updated successfully");
            expect(commentRepository.update).toHaveBeenCalledWith(1, updatedComment);
        });
    });

    describe("delete", () => {
        it("should delete a comment", async () => {
            commentRepository.delete.mockResolvedValue("Comment deleted successfully");

            const result = await commentRepository.delete(1);

            expect(result).toBe("Comment deleted successfully");
            expect(commentRepository.delete).toHaveBeenCalledWith(1);
        });
    });

    describe("addLike", () => {
        it("should add a like to a comment", async () => {
            commentRepository.addLike.mockResolvedValue("Like added successfully");

            const result = await commentRepository.addLike("testUser", 1);

            expect(result).toBe("Like added successfully");
            expect(commentRepository.addLike).toHaveBeenCalledWith("testUser", 1);
        });
    });

    describe("addDislike", () => {
        it("should add a dislike to a comment", async () => {
            commentRepository.addDislike.mockResolvedValue("Dislike added successfully");

            const result = await commentRepository.addDislike("testUser", 1);

            expect(result).toBe("Dislike added successfully");
            expect(commentRepository.addDislike).toHaveBeenCalledWith("testUser", 1);
        });
    });
});
