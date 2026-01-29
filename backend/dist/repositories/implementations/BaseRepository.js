"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findById(id, options) {
        let query = this.model.findById(id);
        if (options?.select) {
            query = query.select(options.select);
        }
        return query.exec();
    }
    async findOne(filter, options) {
        let query = this.model.findOne(filter);
        if (options?.select) {
            query = query.select(options.select);
        }
        return query.exec();
    }
    async create(data) {
        const doc = new this.model(data);
        return doc.save();
    }
    async updateById(id, data) {
        return this.model.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    }
    async executeFindWithPagination(page, limit, filter = {}, options) {
        const skip = (page - 1) * limit;
        let query = this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
        if (options?.select) {
            query = query.select(options.select);
        }
        const [users, totalUsers] = await Promise.all([
            query.exec(),
            this.model.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            users,
            totalPages,
            currentPage: page,
            totalUsers,
        };
    }
}
exports.BaseRepository = BaseRepository;
