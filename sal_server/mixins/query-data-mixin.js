var Logger = require('../logging').logger();

var applyFilters = function(query, filters) {
    Logger.info('QueryDataMixin', 'applyFilters', 'Invocation of applyFilters().');
    filters.forEach(function(filter) {
        var field = filter.field, value = filter.value;
        if(field && value && typeof field === 'string' && typeof value === 'string') {
            Logger.info('QueryDataMixin', 'applyFilters', 'Query will be filtered by field "'+field+'" for value "'+value+'".');
            query.where(field).equals(value);
        }
    });

    return query;
};

var applySorters = function(query, sorters) {
    Logger.info('QueryDataMixin', 'applySorters', 'Invocation of applySorters().');
    sorters.forEach(function(sorter) {
        var field = sorter.field, dir = sorter.direction;
        if(field && dir && typeof field === 'string' && typeof dir === 'string') {
            // Use ascending order by default
            dir = (dir.toUpperCase() === "DESC") ? 'desc' : 'asc';

            Logger.info('QueryDataMixin', 'applySorters', 'Query will be sortered by field "'+field+'" with direction "'+dir+'".');
            var sort = {};
            sort[field.valueOf()] = dir;
            query.sort(sort);
        }
    });

    return query;
};

var applyLimit = function(query, limit) {
    Logger.info('QueryDataMixin', 'applyLimit', 'Invocation of applyLimit().');
    // If limit is a string, we need to parse the string
    if(typeof limit === 'string') {
        limit = parseInt(limit)
    }

    if(typeof limit === 'number') {
        Logger.info('QueryDataMixin', 'applyLimit', 'Query will be limited to "'+limit+'".');
        query.limit(limit);
    }

    return query;
};

/**
 * Applies the given query paramters to the provided query.
 * @param  {[type]} query       [description]
 * @param  {[type]} queryParams [description]
 * @return {[type]}             [description]
 */
exports.applyQueryParams = function(query, queryParams) {
    Logger.info('QueryDataMixin', 'applyQueryParams', 'Invocation of applyQueryParams().');
    if(queryParams === undefined) {
        return query;
    }

    if(queryParams.filters !== undefined) {
        query = applyFilters(query, queryParams.filters);
    }

    if(queryParams.sorters !== undefined) {
        query = applySorters(query, queryParams.sorters);
    }

    if(queryParams.limit !== undefined) { // 0 should be a possible limit param
        query = applyLimit(query, queryParams.limit);
    }

    return query;
};