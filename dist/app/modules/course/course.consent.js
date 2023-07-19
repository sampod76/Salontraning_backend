"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COURSE_TYPES = exports.COURSE_FILTERABLE_FIELDS = exports.COURSE_SEARCHABLE_FIELDS = void 0;
exports.COURSE_SEARCHABLE_FIELDS = [
    'title',
    'publisherName',
    'header_1',
    'description',
    'tag',
    'header_2',
    'courseId',
];
exports.COURSE_FILTERABLE_FIELDS = [
    'searchTerm',
    'price',
    'status',
    'publisher',
    'date',
    'categoryDetails.category',
    'reviews.star',
    'select',
];
exports.COURSE_TYPES = ['free', 'paid', 'open', 'closed', 'recurrig'];
